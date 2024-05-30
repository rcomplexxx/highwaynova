import paypal from "@paypal/checkout-server-sdk";
import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";
import subscribe from '@/utils/subcsribe'


const limiterPerDay = new RateLimiter({
  apiNumberArg: 3,
  tokenNumberArg: 24,
  expireDurationArg: 86400, //secs
});

// Set up your PayPal credentials
const clientId = process.env.PAYPAL_CLIENT_ID; // PayPal Client ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET; // PayPal Client Secret

// Create a PayPal client
const environment =
  process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

const approvePayment = async (req, res) => {
  const { paymentId, paymentMethod, customerSubscribed } = req.body;
  console.log(paymentId);




  const updateDb = async () => {
    return new Promise((resolve, reject) => {
      try {
        const db = betterSqlite3(process.env.DB_PATH);

        // Updating the 'approved' field in the 'orders' table using prepared statements

        const result = db
          .prepare("UPDATE orders SET approved = ? WHERE paymentId = ? AND paymentMethod = ?")
          .run(1, paymentId, paymentMethod);

        // Check the result of the update operation
        if (result.changes > 0) {
          // If changes were made, resolve the promise
          resolve("Order approved successfully.");
        } else {
          // If no changes were made, reject the promise with an error message
          reject("Error: Order not found or not updated.");
        }

        // Closing the database connection
        db.close();
      } catch (error) {
        reject("Error in database operations." + error);
      }
    });
  };



  const updateAddress = async (email,shippingAddress) => {
    return new Promise((resolve, reject) => {
      try {
        const db = betterSqlite3(process.env.DB_PATH);

        // Updating the 'approved' field in the 'orders' table using prepared statements

  const paypalExpressChecker=  db.prepare(`SELECT address, city FROM orders WHERE paymentId = ? AND paymentMethod = ?` ).get(paymentId, paymentMethod);
          if(!paypalExpressChecker)throw new Error('Something went wrong. No data found in the database for the specified paymentId and paymentMethod.');
          if(paypalExpressChecker.address!="" && paypalExpressChecker.city!="")return resolve();
  console.log('Paypal express!', paypalExpressChecker);
 
        const fullName=shippingAddress.name.full_name;

        console.log("Here is my data!",email, fullName.slice(0, fullName.indexOf(" ")), fullName.slice(fullName.indexOf(" "), fullName.length), shippingAddress.address.address_line_1, shippingAddress.address.address_line_2,shippingAddress.address.country_code, shippingAddress.address.postal_code, shippingAddress.address.admin_area_1,shippingAddress.address.admin_area_2 , paymentId, paymentMethod)
        

        if(customerSubscribed)
          subscribe(email, "checkout");
        else subscribe(email, "checkout x");

        const myCustomerId = db.prepare(`SELECT id FROM customers WHERE email = ?`).get(email)?.id;
        


        const result = db
          .prepare("UPDATE orders SET customer_id = ?, firstName = ?, lastName = ?, address = ?, apt = ?, country = ?, zipcode =?, state = ?, city=? WHERE paymentId = ? AND paymentMethod = ?")
          .run(myCustomerId, fullName.slice(0, fullName.indexOf(" ")), fullName.slice(fullName.indexOf(" "), fullName.length), shippingAddress.address.address_line_1, shippingAddress.address.address_line_2,shippingAddress.address.country_code, shippingAddress.address.postal_code, shippingAddress.address.admin_area_1,shippingAddress.address.admin_area_2 , paymentId, paymentMethod);
          // , phone=?
        // Check the result of the update operation
        console.log('result',result);
        if (result.changes > 0) {
          // If changes were made, resolve the promise
          resolve("Order approved successfully.");
        } else {
          // If no changes were made, reject the promise with an error message
          reject("Error: Order not found or not updated.");
        }

        // Closing the database connection
        db.close();
      } catch (error) {
        reject("Error in database operations." + error);
      }
    });
  };


  const approvedConsequence= async(email)=>{

    await updateDb();


    console.log('did customer subed', customerSubscribed);
    
    if(customerSubscribed)
      subscribe(email, "checkout");
    else subscribe(email, "checkout x");
      




  }





  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerDay.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    if(paymentMethod.includes('PAYPAL')){
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    
    request.requestBody({});
    const response = await client.execute(request);
    console.log('Response details:', response.result);
    console.log('Shipping Address:', response.result.purchase_units[0].shipping);
    console.log('payments:', response.result.purchase_units[0]. payments);
   
    //Nadgledam adresu
    if (response.result && response.result.status) {
      let status = response.result.status;
      // Check if the capture was successful
      if (response.result.status === "COMPLETED") {
        console.log('hello!', response.result.purchase_units[0].shipping)

        await updateAddress(response.result.payer.email_address,response.result.purchase_units[0].shipping);
        
        await approvedConsequence(response.result.payer.email_address);
        return res.status(200).json({ message: "Payment successful" });
      } else if (response.result.status === "INSTRUMENT_DECLINED") {
        res.status(500).json({ error: "INSTRUMENT_DECLINED" });
      } else {
        res.status(500).json({ error: response.result.status });
      }
    }
  } 
  // else if(paymentMethod==='STRIPE'){
  //   await approvedConsequence();
  //   return res.status(200).json({ message: "Payment successful" });
  // }

    res.status(500).json({ error: response.result });
  } catch (error) {
    console.error("Capture request failed:", error);
    res.status(500).json({ error: "Verification error." });
  }
};

export default approvePayment;
