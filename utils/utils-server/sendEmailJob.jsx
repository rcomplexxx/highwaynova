const cron = require('node-cron');
const nodemailer = require("nodemailer");
const hashData = require('./hashData');
const products = require('../../data/products.json')
const coupons = require('../../data/coupons.json')
const getPool = require('@/utils/utils-server/mariaDbPool');
const findBestBundle = require('../utils-client/findBestBundle');


async function scheduleEmailSendJob(dateInUnix, campaignId){


  const date =formatDateToCron(dateInUnix);
console.log('Scheduling email for', date, new Date(dateInUnix));




cron.schedule(date, async () => await emailSendJob(campaignId));



}





 async function emailSendJob(campaignId) {


  


  let dbConnection;


 
  
    try{


      
    


      dbConnection = await getPool().getConnection();



     
      
   





      const campaign = (await dbConnection.query(`
        SELECT ec.*, JSON_EXTRACT(es.emails, '$') AS sequenceEmailPointers
        FROM email_campaigns ec
        JOIN email_sequences es ON ec.sequenceId = es.id
        WHERE ec.id = ?
      `, [campaignId]))[0];
      
      if (!campaign) throw new Error('Campaign error. Campaign deleted.');



      const currentEmailIndex = campaign.emailSentCounter;
      
      const isLastEmail = currentEmailIndex === campaign.sequenceEmailPointers.length - 1;

      const nextEmailIndex = currentEmailIndex + 1;



      
      const email = (await dbConnection.query(`
        SELECT title, text FROM emails 
        WHERE id = ?
      `, [campaign.sequenceEmailPointers[currentEmailIndex]?.id]))[0];
      
      if (!email) throw new Error('email_doesnt_exist');

      







      let campaignLegit;

      const emailPromises = [];

      const removedTargets=[];

      


    

      const targets = JSON.parse(campaign.targetCustomers);
      
      // Pre-configure the transporter outside the loop
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });




      const sendEmail = async(target, resolve= undefined)=>{

        console.log('Send email function activated! Target:', target);

     
        

       const localDbConnection = resolve ? await getPool().getConnection() : dbConnection;

        try {

          console.log('Checking resolve information',resolve)
        
          
          
          const finalEmailText = await finalizeEmailText(email.text, target, campaign.extraData, dbConnection);
          console.log('Email title:', campaign.title);
      
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: target,
            subject: email.title,
            html: finalEmailText,
          });
      
          console.log('Email sending succeeded');


          await localDbConnection.query(`UPDATE customers SET emailBounceCount = 0 WHERE email = ?`, [ target]);
        
          campaignLegit = true;

        
          if (resolve) resolve();

        } catch (error) {


          console.error('Email sending failed:', error);

          //Ovde pokupim bounce, i ako je manji od 3 pozovem ponovo funkciju  sendEmail za 15 sekunde preko timeOut sa isti target, a ako nije, iskuliram

         
          await localDbConnection.query(
            `UPDATE customers SET emailBounceCount = emailBounceCount + 1 WHERE email = ?`,
            [target]
          );

          const [{ emailBounceCount }] = await localDbConnection.query(
        `SELECT emailBounceCount FROM customers WHERE email = ?`, 
        [target]
      );

          console.log(`emailBouncCount for customer ${target} is`, emailBounceCount)

          

          if (emailBounceCount < 4) {
            const retryEmail = (resolve) => setTimeout(async() => await sendEmail(target, resolve), 15000);
            resolve ? retryEmail(resolve) : emailPromises.push(new Promise((res) => retryEmail(res)));
          } else  if(resolve)
          {
            removedTargets.push(target);
            resolve();}
          

        }

        finally{
            if(resolve)await localDbConnection.release();
        }

      
        

      }


      
      for (const target of targets)  {
        await sendEmail(target);
      }

      if(emailPromises.length>0){
        console.log('promises are being held', emailPromises)
      await dbConnection.release();
      await Promise.all(emailPromises);
      dbConnection=await getPool().getConnection();

      }


      
    
      if (removedTargets.length > 0) {
        const remainingTargets =  targets.filter((target) => !removedTargets.includes(target));

        
        //Ovde updatujem kampanju zamenom targeta za preostale targete(bez removedTargets)
        const query = remainingTargets.length
          ? `DELETE FROM email_campaigns WHERE id = ?`
          : `UPDATE email_campaigns SET targetCustomers = ? WHERE id = ?`;
        
        await dbConnection.query(query, remainingTargets.length ? [JSON.stringify(remainingTargets), campaign.id] : [campaign.id]);
      }

    







              
              const updateCampaignStatus = async()=>{

                
              const campaignCleaning = async () => {
                const isSpecialSequence = [
                  process.env.THANK_YOU_SEQUENCE_ID,
                  process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID,
                  process.env.WELCOME_SEQUENCE_ID,
                ].includes(campaign.sequenceId.toString());
              
          
                
              
                const query = isSpecialSequence
                  ? `DELETE FROM email_campaigns WHERE id = ?`
                  : `UPDATE email_campaigns SET finished = 1 WHERE id = ?`;
              
                await dbConnection.query(query, [campaignId]);
              };

                
              if (!campaignLegit) {
                if (campaign.sendFailCounter >= 10) return await campaignCleaning();
                console.log("Campaign not working as expected", `\n sendFailCounter is`, campaign.sendFailCounter + 1);
                await dbConnection.query(`UPDATE email_campaigns SET sendFailCounter = sendFailCounter + 1 WHERE id = ?`, [campaignId]);
                await scheduleEmailSendJob(Date.now() + ((campaign.sendFailCounter + 1) % 3 === 0 ? 7200000 : 61000), campaignId);
                return;
              }
            
              console.log('W in the chat! Campaign legit, done!');
              if (isLastEmail) return await campaignCleaning();
            
              const nextEmailUnixDate = campaign.sequenceEmailPointers
                .slice(0, nextEmailIndex)
                .reduce((acc, emailPointer) => acc + (parseInt(emailPointer.sendTimeGap) || 0), parseInt(campaign.sendingDateInUnix));
            
              await dbConnection.query(`UPDATE email_campaigns SET emailSentCounter = ?, sendFailCounter = ? WHERE id = ?`, [nextEmailIndex, 0, campaignId]);
              await scheduleEmailSendJob(nextEmailUnixDate, campaignId);


              }


              await updateCampaignStatus();
              
              
            

    
           


      

  }
    catch(error){
        console.log('cron error', error)
    }

 
       
    finally{
     if(dbConnection) await dbConnection.release();
    }





 }

























 




 async function finalizeEmailText(emailText, customerEmail, campaignExtraData, dbConnection){

  

  console.log('starting finalization');
  if (!emailText.match(/\{\{[^\s\]]+\}\}/)) return emailText;

  let transformedEmailText = emailText;

  if (emailText.includes('{{order_id}}')) { // Simplified match check
    const { orderId } = JSON.parse(campaignExtraData); // Destructure orderId directly
    transformedEmailText = transformedEmailText.replace(/\{\{order_id\}\}/g, `#${orderId}`);

    const order = (await dbConnection.query(
      `SELECT total, items, tip, couponCode, paymentMethod FROM orders WHERE id = ?`, [orderId]
    ))[0];

    let items = JSON.parse(order.items).map(item => {
      const { name, price, images, stickerPrice, variants } = products.find(p => p.id === item.id);

      const currentVariant = variants?.find(v =>{return v.name.toLowerCase().replace(/\s+/g, "-") === item.variant?.toLowerCase().replace(/\s+/g, "-")});


   
      if(currentVariant) return {...item, name, price, stickerPrice, productImage: images[currentVariant?.variantProductImageIndex]}
      

      else return {...item, name, price, stickerPrice, productImage: images[0]}
    });
    if(!order.couponCode || order.couponCode ==='')items = findBestBundle(items)

     
      


    const fontFamily = transformedEmailText.match(/font-family:[^;]*;/);
  
    
    const orderDetailsColors = emailText.match(/{{order_details\[(.*?)\]}}/)?.[1].split(',') || [];

    console.log('order colors', orderDetailsColors);



    console.log('starting finalization', order, 'checking all coupons', coupons);
 
    

   const { subTotal, itemsHtml } = items.reduce((acc, item) => {
    console.log('item', item);
    
    
    const itemPrice = item.quantity * item.price;
    
    acc.subTotal += itemPrice;
    acc.itemsHtml += `
      <tr>
        <td style="padding: 8px 16px; width: 1%; white-space: nowrap;">
          <img
            style='border-radius: 4px;'
            src="${process.env.NEXT_PUBLIC_WEBSITE_ROOT_URL}/images/${item.productImage}"
            alt="${item.name}"
            height="48px"
            width="48px"
            sizes="48px"
          />
        </td>
        <td colspan="2" style="padding: 12px 0; vertical-align: middle;${fontFamily}">
          <span style="display: block;">${item.quantity} ${item.name}${item.quantity > 1 ? 's' : ''}</span>
          ${item.variant ? `<span style="display: block; padding-left: 2px; padding-top: 2px; font-size: 14px; color: ${orderDetailsColors[0]};">Color: ${item.variant}</span>` : ''}
       
         ${item.bundleLabel ?`
          
        
          <div style="display: inline-block; padding-left: 2px; vertical-align:middle;">

 <svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; padding-top: 1px;" height="14" width="14" viewBox="0 0 14 14">
  <path fill="transparent" stroke="${orderDetailsColors[0]}" d="M7.284 1.402h4.964a.35.35 0 0 1 .35.35v4.964a.7.7 0 0 1-.205.495L7.49 12.115a.7.7 0 0 1-.99 0L1.885 7.5a.7.7 0 0 1 0-.99L6.79 1.607a.7.7 0 0 1 .495-.205Z"/>
  <circle fill="${orderDetailsColors[0]}" cx="9.1" cy="4.9" r="1"/>
</svg>

           <span style="padding-left: 1px; font-size: 12px; vertical-align: middle; color: ${orderDetailsColors[0]};">BUY ${item.bundleLabel} (-$${ parseFloat(((item.priceBeforeBundle - item.price).toFixed(2))*item.quantity).toFixed(2)})</span>
           </div>`:''}
         
           </td>
        <td style="padding: 12px 16px 12px 0; vertical-align: middle; text-align: right;white-space: nowrap;${fontFamily}">


        ${item.stickerPrice ? `<span style="display: block; color: ${orderDetailsColors[1]}; 
        text-decoration: line-through; font-size: 12px; padding-bottom: 2px;">$${(item.quantity * item.stickerPrice).toFixed(2)}</span>`: ""}
      
       
        
             
         <span style="display: block;">$${(item.quantity * item.price).toFixed(2)}</span>
        
        </td>
      </tr>
    `;
    
    return acc;
  }, { subTotal: 0, itemsHtml: '' });

  const finalSubTotal = subTotal.toFixed(2);



  let discount;
  

  if(order.couponCode){

  discount = coupons.find(c=> {return c.code.toLowerCase()===order.couponCode.toLowerCase()});

  discount ={...discount, discountPercentage: (finalSubTotal * discount?.discountPercentage / 100).toFixed(2)}
  }
  // else  if (items.some(item => item.priceBeforeBundle)){

      
  // const bundleDiscount = items.reduce(
  //   (total, item) => total + (item.priceBeforeBundle ? item.quantity * (item.priceBeforeBundle - item.price) : 0), 
  //   0
  // );

  // discount = { code: "BUNDLE", discountPercentage: bundleDiscount.toFixed(2) };
  


  //   }

  



  
  



  const orderDetailsHtml = `
  <table border="0" role="presentation">
    <tbody>
      <tr><td colspan="4" style="height: 24px;"></td></tr>
      ${itemsHtml}
      <tr><td colspan="4" style="padding: 12px 16px;"><div style="height: 1px; background-color: #292929;"></div></td></tr>
      <tr>
        <td colspan="3" style="padding: 12px 16px; text-align: left; ${fontFamily}">Subtotal</td>
        <td style="padding: 12px 16px; text-align: right; ${fontFamily}">$${finalSubTotal}</td>
      </tr>
      ${discount && discount.discountPercentage!=='0.00'? `
      <tr>
        <td colspan="3" style="padding: 12px 16px; text-align: left; ${fontFamily}">Coupon (${discount.code.toUpperCase()})</td>
        <td style="padding: 12px 16px; text-align: right; ${fontFamily}">- $${discount.discountPercentage}</td>
      </tr>` : ''}
      <tr>
        <td colspan="3" style="padding: 12px 16px; text-align: left; ${fontFamily}">Shipping</td>
        <td style="padding: 12px 16px; text-align: right; ${fontFamily}">Free</td>
      </tr>
      ${order.tip && order.tip !== '0.00' ? `
      <tr>
        <td colspan="3" style="padding: 12px 16px; text-align: left; ${fontFamily}">Tip</td>
        <td style="padding: 12px 16px; text-align: right; ${fontFamily}">$${order.tip}</td>
      </tr>` : ''}
      <tr><td colspan="4" style="padding: 12px 16px;"><div style="height: 1px; background-color: #292929;"></div></td></tr>
      <tr>
        <td colspan="3" style="padding: 13px 16px; text-align: left; ${fontFamily}">Total</td>
        <td style="padding: 12px 16px; text-align: right; font-weight: 700; color: ${orderDetailsColors[2]}; ${fontFamily}">$${order.total.toFixed(2)} USD</td>
      </tr>
    </tbody>
  </table>`;


  
   transformedEmailText = transformedEmailText.replace(/<table[^>]*>(?:(?!<\/table>)[\s\S])*{{order_details\[[^\]]*\]}}[\s\S]*?<\/table>/g, orderDetailsHtml);

  
  }

  // Opsta zamena promenljivih primenljivih u svaki e-mail

  const customerId = (await dbConnection.query(`SELECT id FROM customers WHERE email = ? LIMIT 1`, [customerEmail]))[0]?.id;


  const saltedTokenInput = customerEmail+ customerId;
  const customer_hash = hashData(saltedTokenInput);
  
  console.log('customers hash is', customer_hash)


  transformedEmailText = transformedEmailText.replace(/\{\{customer_id\}\}/g, customerId).replace(/\{\{customer_hash\}\}/g, customer_hash)
   




  
  



 return transformedEmailText;
 

}




function formatDateToCron(date) {
  let finalSendingDate = new Date(Math.max(Date.now() + 61000, date));

  console.log('finalSendingDate is', finalSendingDate);

  const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = [
    finalSendingDate.getSeconds(),
    finalSendingDate.getMinutes(),
    finalSendingDate.getHours(),
    finalSendingDate.getDate(),
    finalSendingDate.getMonth() + 1, // Months are zero-indexed
    finalSendingDate.getDay()
  ];

  return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}


 module.exports = {scheduleEmailSendJob, emailSendJob};