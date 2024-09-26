const getPool = require('@/utils/utils-server/mariaDbPool');
import {emailSendJob} from "@/utils/utils-server/sendEmailJob";


async function subscribe(email, source, extraData,dbConnectionArg) {

  let dbConnection;




  try{



    dbConnection = dbConnectionArg || await getPool().getConnection();


    


    const sendAutomatedSequence = async (sequenceType, totalOrderCount = null) => {

      // Determine the sequenceId based on the sequenceType and totalOrderCount
      const sequenceId = sequenceType === "subscribe_sequence" 
        ? process.env.WELCOME_SEQUENCE_ID 
        : (totalOrderCount === 1 
            ? process.env.THANK_YOU_SEQUENCE_FIRST_ORDER_ID 
            : process.env.THANK_YOU_SEQUENCE_ID);
    
      // Correct the campaignName logic
      const campaignName = sequenceType === "subscribe_sequence" 
        ? `Welcome ${email}` 
        : `Thank you ${email}`;
    
      // Insert into the email_campaigns table

      

      const columns = ['title', 'sequenceId', 'sendingDateInUnix', 'emailSentCounter', 'retryCounter', 'targetCustomers'];
      const values = [campaignName, sequenceId, Date.now() + 5000, 0, 0, JSON.stringify([email])];
    
      // If in buying sequence and extraData.orderId is provided, add it to the query
      if (sequenceType !== "subscribe_sequence" && extraData.orderId) {
        columns.push('extraData');
        values.push(JSON.stringify({ orderId: extraData.orderId }));
      }
      
    
      // Execute the query and get the campaignId
      const campaignId = (await dbConnection.query(
        `INSERT INTO email_campaigns (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, 
        values
      )).insertId;
    
      // Schedule the email job
      emailSendJob(campaignId);
    };



    

    



    


   
    const result = (await dbConnection.query(
      "SELECT totalOrderCount, subscribed FROM customers WHERE email = ? LIMIT 1", [email]
    ))[0];

    // If no customer found, insert new customer and trigger subscription sequence
    if (!result) {
      await dbConnection.query(
        "INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)",
        [email, 0, 1, source]
      );
      await sendAutomatedSequence("subscribe_sequence");

      // No further checks needed since a new customer can't be from checkout
    } else {
      // If re-subscribe, just update subscription status
      if (source === 're_subscribe') {
        await dbConnection.query("UPDATE customers SET subscribed = 1 WHERE email = ?", [email]);
        return true;
      }

      // Handle post-buying sequence if source indicates checkout
      if (source.includes("checkout")) {
        await sendAutomatedSequence("post_buying_sequence", result.totalOrderCount);
      }

      // Determine if the user should be subscribed (non-checkout and not already subscribed)
      const newSubscribe = !result.subscribed && source !== "checkout x";

      // Update subscription if required
      if (newSubscribe) {
        await dbConnection.query("UPDATE customers SET subscribed = 1 WHERE email = ?", [email]);
        await sendAutomatedSequence("subscribe_sequence");
      }

      console.log("Successfully subscribed. Is person new subscriber?", newSubscribe, email);
    }

    return true;
  } catch (error) {
    console.log('subscribe error', error);
    return false;
  } finally {
    if (!dbConnectionArg && dbConnection) await dbConnection.release();
  }
};





module.exports =  subscribe;