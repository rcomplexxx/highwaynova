const cron = require('node-cron');
const nodemailer = require("nodemailer");
const hashData = require('./hashData');
const products = require('../data/products.json')
const coupons = require('../data/coupons.json')
const getPool = require('./mariaDbPool');





 async function emailSendJob( dateInUnix, campaignId) {


//

   



  


const date =formatDateToCron(dateInUnix);
console.log('setting email cron scheduler', date)

cron.schedule(date, async() => {
  console.log('Send email here');

  const dbConnection = await (await getPool()).getConnection();;


 
  
    try{
    


       


     
    console.log('Should execute campaign with id', campaignId)
   





    const campaign = (await dbConnection.query(`
      SELECT ec.*, es.emails
      FROM email_campaigns ec
      JOIN email_sequences es ON ec.sequenceId = es.id
      WHERE ec.id = ?
    `, [campaignId]))[0];


console.log('This is campaign data.', campaign);

if(!campaign) throw new Error('campaign_deleted')





    const currentEmailIndex = campaign.emailSentCounter

    const sequenceEmailPointers = JSON.parse(campaign.emails);
 





        const email = (await dbConnection.query(`SELECT title, text FROM emails WHERE id = ?`,[sequenceEmailPointers[currentEmailIndex]?.id]))[0];

        if(!email) {console.log('campaign finished.'); return;}

        console.log( 'em pointers', sequenceEmailPointers )
        
        let targets= JSON.parse(campaign.targetCustomers);


        console.log('targets', targets)

         
         
              
       
      //odraditi neku foru da izvucem da li ova kampanja markuje iz campaigne
             
          

              

            
         
         
         
           

         
         
         
         
         
         
        



          

            try {


              for(const target of targets){

                
              const finalEmailText = await finalizeEmailText(email.text, target, campaign.extraData, dbConnection)

              console.log('Sending email! _______________________________________________________');

              
             

             const transporter = nodemailer.createTransport({
               host: process.env.EMAIL_HOST,
               port: Number(process.env.EMAIL_PORT),
               auth: {
                 user: process.env.EMAIL_USER,
                 pass: process.env.EMAIL_PASSWORD,
               },
             });
   
             transporter.sendMail({
               //   from: 'orderconfirmed@selling-game-items-next.com',
               from: process.env.EMAIL_USER,
               to: target,
               subject: email.title,
               html: finalEmailText,
             });

              }


        

              if(currentEmailIndex===sequenceEmailPointers.lenght-1)

                for(const target of targets){

                  await db.query(`UPDATE customers SET currentCampaign = ? WHERE email = ?`, [
                    null,
                    target.email
                  ]
                );
                  
                }

            



              let sendTimeGap = parseInt(sequenceEmailPointers[currentEmailIndex+1]?.sendTimeGap);
              if(!sendTimeGap || isNaN(sendTimeGap)) sendTimeGap = 0;

           
        
            let dateCalculated = parseInt(campaign.sendingDateInUnix);
            
            sequenceEmailPointers.forEach((emailPointer, index) =>{
            
              if(index!==0 && index < currentEmailIndex+1)
              dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
           
        
            })



              let   finalSendingDate=(Date.now() - dateCalculated > 0)?
              Date.now()+sendTimeGap: dateCalculated+sendTimeGap;



              
        if(currentEmailIndex < sequenceEmailPointers.length)
          {
            console.log(`SCHEDULING NEXT EMAIL FOR`, new Date(finalSendingDate))

            await emailSendJob( finalSendingDate, campaignId)
          }

          else if(campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_ID || campaign.sequenceId.toString() === process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID ||
            campaign.sequenceId.toString() === process.env.WELCOME_SEQUENCE_ID) {

          await dbConnection.prepare(`DELETE FROM email_campaigns WHERE id = ?`,[campaignId]);
          
          await dbConnection.release();
          return;

         }

         else{
          

           
         await dbConnection.query(`UPDATE email_campaigns SET finished = 1 WHERE id = ?`,
            [campaign.id]
        );

         }
          




        await dbConnection.query(`UPDATE email_campaigns SET emailSentCounter = ?, retryCounter = ? WHERE id = ?`, [
        currentEmailIndex + 1,
        0,
          campaign.id]
        );



            }
            
            
            
            catch (error) {
              console.error("Email not sent, trying again.", error,`/n retryCounter is`, campaign.retryCounter+1);

           

             

               await dbConnection.query(`UPDATE email_campaigns SET retryCounter = retryCounter + 1 WHERE id = ?`, [campaign.id] );
                  

                  if( campaign.retryCounter<10)
              
                await  emailSendJob( (campaign.retryCounter+1)%3===0?Date.now()+10800000:Date.now()+120000, campaignId)
        
                else {
                  
                  // reserveTargetedCustomers INTEGER DEFAULT 0,
                  // targetEvenReservedCustomers INTEGER DEFAULT 1,
                  // finished INTEGER DEFAULT 0
                  
               
                    await dbConnection.query(`UPDATE email_campaigns SET finished = 1 WHERE id = ?`, 
                      [campaign.id]
                  );
                

                }
           
              }
         
            
  
          
            
    }
    catch(error){

      if (error.message === 'campaign_deleted') {
        console.error(' Campaign error', error);
      }

        else { console.log('cron error', error)}
    }

 
       
    finally{
      await dbConnection.release();
    }





}
);


 }












 async function finalizeEmailText(emailText, customerEmail, campaignExtraData, dbConnection){


  console.log('starting finalization');
  if(!emailText.match(/\{\{[^\s\]]+\}\}/)) return emailText;

  let transformedEmailText = emailText;


  console.log('starting finalization');
  
  if(emailText.match(/\{\{order_id\}\}/)) {

    //Prepoznata je post_purchase sekvenca, replacovati sve order_ promenljive

    const orderId= JSON.parse(campaignExtraData).orderId;

   transformedEmailText = transformedEmailText.replace(/\{\{order_id\}\}/g, `#${orderId}` );


   console.log('starting finalization');

   const order = (await dbConnection.query(`SELECT total, items, tip, couponCode, paymentMethod FROM orders WHERE id = ?`, [orderId]))[0];
   

   const items = JSON.parse(order.items);
  //[ { id: 0, quantity: '1', variant: 'Wood grain' } ]

   let subTotal = 0;

    let itemsHtml= ``;


    const fontFamily =  transformedEmailText.match(/font-family:[^;]*;/);

    let orderDetailsColors ;


    const match = emailText.match(/{{order_details\[(.*?)\]}}/)


    if (match && match[1]) {
      // Split the string by comma and trim whitespace
      orderDetailsColors = match[1].split(',');

    }


    console.log('starting finalization');
    items.forEach((item)=>{

      console.log('item',item)

    const itemSource = products.find((p)=>p.id===item.id)

    const itemPrice = parseFloat((item.quantity * itemSource.price).toString(),2);
    

    subTotal = subTotal + itemPrice;


    itemsHtml= itemsHtml + `<tr>
    
    <td style="padding: 8px 16px;
     width: 1%;
    white-space: nowrap;
   
    ">
    <img
      style='border-radius: 4px;'
  src="${process.env.NEXT_PUBLIC_WEBSITE_ROOT_URL}/images/${itemSource.images[0]}"
  alt=${itemSource.name}
  height="48px"
  width="48px"
  sizes="48px"
/>
  </td>
 <td colspan="2" style="padding: 12px 0; vertical-align: middle;${fontFamily}">
 <span style="display: block; ">${item.quantity} ${`${itemSource.name}${item.quantity>1?'s':''}`}</span>
    ${item.variant?`<span style="display: block; padding-left: 2px; padding-top: 2px; font-size: 14px; color: ${orderDetailsColors[0]};">Color: ${item.variant}</span>`:""}
 
 </td>

    
     <td style="padding: 12px 16px 12px 0; vertical-align: middle; text-align: right;white-space: nowrap;${fontFamily}">$${itemPrice}</td>
    
    </tr>`
   })






   

  console.log(order);
  console.log(coupons)

  const discount = coupons.find(c=> {return c.code.toLowerCase()===order.couponCode.toLowerCase()})?.discountPercentage;





   
   const orderDetailsHtml = `<table border="0" role="presentation"> <tbody>

  
   <tr> 
   <td colspan="4"> <div style="height: 24px; width: 100%;"></div> 
   </td> 
   </tr>

   ${itemsHtml}

  <tr> <td colspan="4" style="width: 100%; padding: 12px 16px 12px 16px;">
   <div style="height: 1px; width: 100%; background-color: #292929; "/>
  </td>

  <tr>
    
    <td  colspan='3'  style="padding: 12px 16px; text-align: left;width: 1%;
            white-space: nowrap;${fontFamily}">Subtotal</td>
    <td style="padding: 12px 16px 8px 0;text-align: right;white-space: nowrap;${fontFamily}">$${subTotal}</td>
  </tr>

   ${discount ? `<tr>
  
    <td colspan='3' style="padding: 12px 16px;text-align: left;width: 1%;
            white-space: nowrap;${fontFamily}">Coupon(${order.couponCode})</td>
    <td style="padding: 12px 16px 8px 0;text-align: right;white-space: nowrap;${fontFamily}">- $${(subTotal*discount/100).toFixed(2)}</td>
  
  </tr>`:""
   }
  
  <tr>

     <td colspan='3'  style="padding: 12px 16px;text-align: left;width: 1%;
            white-space: nowrap;${fontFamily}">Shipping</td>
    <td  style="padding: 12px 16px 8px 0;text-align: right;white-space: nowrap;${fontFamily}">Free</td>
  </tr>

   ${(order.tip && order.tip!=='0.00') ? `<tr>
   
    <td colspan='3' style="padding: 12px 16px;text-align:left; width: 1%;
            white-space: nowrap;${fontFamily}">Tip</td>
    <td style="padding: 12px 16px 8px 0;text-align: right;${fontFamily}">$${order.tip}</td>
  
  </tr>`:""
   }

     <tr> <td colspan="4" style="width: 100%; padding: 12px 16px 12px 16px;">
   <div style="height: 1px; width: 100%; background-color: #292929; "/>
  </td>

  <tr>

     <td colspan='3' style="padding: 13px 16px 12px;text-align: left;width: 1%;
            white-space: nowrap;${fontFamily}">Total</td>
    <td  style="padding: 12px 16px 16px 0;white-space: nowrap;text-align: right;${fontFamily}font-size: 18px;font-weight: 700;color: ${orderDetailsColors[1]};">$${order.total} USD</td>
  </tr>
  </tbody>
</table>`


console.log('my order details html', orderDetailsHtml)
   transformedEmailText = transformedEmailText.replace(/<table[^>]*>(?:(?!<\/table>)[\s\S])*{{order_details\[[^\]]*\]}}[\s\S]*?<\/table>/g, orderDetailsHtml);

  
  }

  // Opsta zamena promenljivih primenljivih u svaki e-mail

  const customerId = (await dbConnection.query(`SELECT id FROM customers WHERE email = ? LIMIT 1`, [customerEmail]))[0]?.id;

  transformedEmailText = transformedEmailText.replace(/\{\{customer_id\}\}/g, customerId)
   

  const saltedTokenInput = customerEmail+ customerId;
  const customer_hash = hashData(saltedTokenInput);

  console.log('customers hash is', customer_hash)

  
  transformedEmailText = transformedEmailText.replace(/\{\{customer_hash\}\}/g, customer_hash)



 return transformedEmailText;
 

}





 function formatDateToCron(date) {

  console.log('here are dates', Date.now(), date)


  let   finalSendingDate=(Date.now() - date) > 5000?
  Date.now()+5000: date+5000;

              finalSendingDate = new Date(finalSendingDate);


    console.log('finalSendingDate is', finalSendingDate)
    const seconds = finalSendingDate.getSeconds();
    const minutes = finalSendingDate.getMinutes();
    const hours = finalSendingDate.getHours();
    const dayOfMonth = finalSendingDate.getDate();
    const month = finalSendingDate.getMonth() + 1; // Note: Months are zero-indexed in JavaScript
    const dayOfWeek = finalSendingDate.getDay();

    return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}



 module.exports = emailSendJob;