import paypal from "@paypal/checkout-server-sdk";
import RateLimiter from "@/utils/utils-server/rateLimiter.js";
import subscribe from '@/utils/utils-server/subcsribe'
const getPool = require('@/utils/utils-server/mariaDbPool');



const limiterPerDay = new RateLimiter({
  apiNumberArg: 5,
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





let dbConnection;



  const resReturn = async(statusNumber, jsonObject)=>{

    res.status(statusNumber).json(jsonObject)
   
 }
  

  let giftDiscount = false;

  const { paymentId, paymentMethod, customerSubscribed } = req.body;

  







  const updateAddress = async (email,shippingAddress, dbConnection) => {
   
       

    // Updating the 'approved' field in the 'orders' table using prepared statements

const paypalExpressChecker=  (await dbConnection.query(`SELECT address, city FROM orders WHERE paymentId = ? AND paymentMethod = ?`, [paymentId, paymentMethod]))[0];

      if(!paypalExpressChecker)throw new Error('Something went wrong. No data found in the database for the specified paymentId and paymentMethod.');


      if(paypalExpressChecker.address!="" && paypalExpressChecker.city!="") return {message:"Order approved successfully."};
      
      

    const fullName=shippingAddress.name.full_name;
    const address =  shippingAddress.address;

    console.log("Here is my data!",email, fullName.slice(0, fullName.indexOf(" ")),  fullName.slice(fullName.indexOf(" "), fullName.length), 
    address.address_line_1,  address.address_line_2,address.country_code, address.postal_code, address.admin_area_1,address.admin_area_2 , 
    paymentId, paymentMethod)
    



      



    const myCustomerId = (await dbConnection.query(`SELECT id FROM customers WHERE email = ?`, [email]))[0]?.id;
    


    const result = await dbConnection.query("UPDATE orders SET customer_id = ?, firstName = ?, lastName = ?, address = ?, apt = ?, country = ?, zipcode =?, state = ?, city=? WHERE paymentId = ? AND paymentMethod = ?"
      , [myCustomerId, fullName.slice(0, fullName.indexOf(" ")), fullName.slice(fullName.indexOf(" "), fullName.length), 
      address.address_line_1, address.address_line_2,address.country_code, address.postal_code, address.admin_area_1,address.admin_area_2 , paymentId, paymentMethod]);
      // , phone=?
    // Check the result of the update operation
    console.log('result',result);
    if (result.affectedRows === 0) {
      

      throw new Error("Error: Order not found or not updated.");
    }
    
 

};



  const updateDb = async (email,  dbConnection) => {


    

       

        // Updating the 'approved' field in the 'orders' table using prepared statements

      const result = await dbConnection.query(
      `UPDATE orders SET approved = ? WHERE paymentId = ? AND paymentMethod = ?`,
      [1, paymentId, paymentMethod]
    );

        if (result.affectedRows === 0) 
          throw new Error("Error: Order not found or not updated.");




         
 const orderData = (await dbConnection.query(`SELECT id, total, couponCode FROM orders WHERE paymentId = ? AND paymentMethod = ?`, [paymentId, paymentMethod]))[0];
          


       
        

          


          const customerInfo = (await dbConnection.query("SELECT id, used_discounts FROM customers WHERE email = ?", [email]))[0];
          const customerId = customerInfo?.id || (await dbConnection.query("INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)", [email, 0, 0, 'make_payment'])).insertId;

        

          if(customerInfo && JSON.parse(customerInfo.used_discounts).find(discountCode=>  discountCode===orderData.couponCode))
           return await resReturn(400, { success: false, error: "Discount has already been used."})




          await dbConnection.query("UPDATE customers SET totalOrderCount = totalOrderCount + 1, money_spent = ROUND(money_spent + ?, 2) WHERE id = ?", [orderData.total, customerId]); 


        
          const subscribeSource = customerSubscribed? "checkout": "checkout x";

       
      
          await subscribe(email, subscribeSource, {orderId:orderData.id}, dbConnection);
   

         

          if(orderData.couponCode)
        await dbConnection.query(`UPDATE customers SET used_discounts = json_insert(used_discounts, '$[#]', ?), money_spent = money_spent + ? WHERE id = ? `, [orderData.couponCode, orderData.total, customerId])

        
        

          giftDiscount=  (await dbConnection.query(`SELECT 1 FROM customers WHERE id = ? AND totalOrderCount = 1`, [customerId]))[0];

     
          
          

          
       

        // Closing the database connection
       
      


  };







  





  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerDay.rateLimiterGate(clientIp, dbConnection)))
      return await resReturn(429, {error: "Too many requests. Please try again later." })



    dbConnection = await getPool().getConnection();
  
    

    if(paymentMethod.includes('PAYPAL')){
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    
    request.requestBody({});
    const response = await client.execute(request);
    console.log('Response details:', response.result);
    console.log('Shipping Address:', response.result.purchase_units[0].shipping);
    console.log('payments:', response.result.purchase_units[0]. payments);
   
    //Nadgledam adresu
    if (response.result && response.result.status) {
      // let status = response.result.status;
      // Check if the capture was successful
      if (response.result.status === "COMPLETED") {
        console.log('hello!', response.result.purchase_units[0].shipping)

        await updateAddress(response.result.payer.email_address,response.result.purchase_units[0].shipping, dbConnection);
        
        await updateDb(response.result.payer.email_address, dbConnection);
     

        return await resReturn(200, { message: "Payment successful",
          giftDiscount: giftDiscount })

     
          
      } else if (response.result.status === "INSTRUMENT_DECLINED") {

        return await resReturn(500, {  error: "INSTRUMENT_DECLINED"  })

 
      } else {
        

        return await resReturn(500, { error: response.result.status })

        
      }
    }
  } 

  
  return await resReturn(500, { error: "Payment was not approved." })

 
  
  } catch (error) {


    console.error("Capture request failed:", error);
    return await resReturn(500, { error: "Server error. Payment was not approved." })

    
  }

  finally{
    
    if(dbConnection) await dbConnection.release();
  }
};

export default approvePayment;
