import {scheduleEmailSendJob} from '@/utils/utils-server/sendEmailJob.jsx';
import getTargets from '@/utils/utils-server/getTargets';



const insertInDb = async(dbConnection, resReturn, table, data) => {



    try {
     
        if(table==='product_returns'){
    
          
           
            
            const orderData = (await dbConnection.query(`
              SELECT customer_id, packageStatus
              FROM orders
              WHERE id = ?
          LIMIT 1`,[data.orderId]))[0];
    
          console.log('order data', orderData)


                //Ako packageStatus vec postoji, koristiti taj. Ako ne, neki drugi
                const packageStatus = ((await dbConnection.query(`SELECT prevPackageStatus FROM product_returns WHERE orderId = ? LIMIT 1`, [data.orderId]))[0]?.prevPackageStatus ?? orderData.packageStatus);


    
            await dbConnection.query(`INSERT INTO product_returns (orderId, items,couponCode, tip, returnCost, createdDate, prevPackageStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [data.orderId,
              data.products,
              data.couponCode,
              data.tip,
              data.returnCost,
              Date.now(),
              packageStatus
    
              ]
            );
    
            await dbConnection.query(`UPDATE orders SET packageStatus = 4 WHERE id = ?`, [data.orderId]);
    
            await dbConnection.query(`UPDATE customers SET money_spent = ROUND(money_spent - ?, 2) WHERE id = ?`,[data.returnCost, orderData.customer_id])
    
    
    
    
            
    
    
            await dbConnection.query(`UPDATE email_campaigns SET emailSentCounter = (
              SELECT JSON_LENGTH(emails) 
          FROM email_sequences 
          WHERE id = email_campaigns.sequenceId
          ) WHERE extraData IS NOT NULL AND extraData = ?`, [JSON.stringify({orderId: data.orderId})])
    
    
    
    
    
    
          }


         else if(table==='emails'){
    
            console.log('in table emails');
           
    
            
    
            const insert_id = (await dbConnection.query(`
              SELECT COALESCE(
                (SELECT MIN(id + 1) 
                 FROM emails 
                 WHERE id + 1 NOT IN (SELECT id FROM emails)
                 AND EXISTS (SELECT 1 FROM emails WHERE id = 1)),
                1
              ) AS insert_id
            `))[0].insert_id;
           
            
    
     
    
            await dbConnection.query(`INSERT INTO emails (id, title, text) VALUES (?, ?, ?)`, [
              insert_id,
              data.title,
              data.text
            ]
            );
    
            
            }

            else if(table==='email_sequences'){
    
    
                console.log('in table email_sequences');
              
        
        
                const sequenceId = (await dbConnection.query(`
                  SELECT COALESCE(
                    (SELECT MIN(id + 1) 
                     FROM email_sequences 
                     WHERE id + 1 NOT IN (SELECT id FROM email_sequences)
                     AND EXISTS (SELECT 1 FROM email_sequences WHERE id = 1)),
                    1
                  ) AS insert_id
                `))[0].insert_id;
        
        
        
        
        
        
                await dbConnection.query(`INSERT INTO email_sequences (id, title, emails) VALUES (?, ?, ?)`,[
                  sequenceId,
                  data.title,
                  data.emails]
                );
        
        
                console.log('should be created3', data.key_sequence_type);
        
                if(data.key_sequence_type){
        
                  console.log('should be created');
        
                 await dbConnection.query(`UPDATE key_email_sequences SET ${data.key_sequence_type} = ? WHERE id = 1`,[sequenceId])
        
                }
                
              }

              
          else if(table==='email_campaigns'){
    
            console.log('in table email_campaigns');
    
            if(data.sequenceId.toString()=== process.env.WELCOME_SEQUENCE_ID || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_ID
          || data.sequenceId.toString()=== process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID)
          return await resReturn(500, { success: false })
     
          
    
            const targets = JSON.stringify(await getTargets(data.targetCustomers, false, dbConnection))
          
            console.log('targets for campaign are ', targets)
    
            const campaignId =   (await dbConnection.query(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter,  retryCounter, targetCustomers, reserveTargetedCustomers) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ data.title,
              data.sequenceId,
              data.sendingDateInUnix,
              0,
              0,
              targets,
              data.markTraffic==="mark_with_current_campaign"?1:0
            ]
              
              
            )).insertId;
    
            //RUN JOB HERE.//
    
            //sendDelayAfterPrevious
    
            console.log('sending date in unix!!', data.sendingDateInUnix)
    
         
            
    
    
            await scheduleEmailSendJob(data.sendingDateInUnix,campaignId);
    
          }



    
          return await resReturn(200, { data_saved: true })
       
        
   
      
    } catch (error) {


      console.error("Error fetching data from database:", error);

      return await resReturn(500, { successfulLogin: false, error: "No data to send" })
      
      
    }
  };


  
module.exports = insertInDb;