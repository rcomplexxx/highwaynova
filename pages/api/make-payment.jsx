import paypal from "@paypal/checkout-server-sdk";
import Stripe from 'stripe';
import productsData from "@/data/products.json";
import findBestBundleServer from '@/utils/utils-server/findBestBundleServer'

import RateLimiter from "@/utils/utils-server/rateLimiter.js";
import coupons from '@/data/coupons.json'
import subscribe from '@/utils/utils-server/subcsribe.js'

const getPool = require('@/utils/utils-server/mariaDbPool');

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

const paypalPay=async(totalPrice, requestShipping)=>{
  let request =  new paypal.orders.OrdersCreateRequest();


  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalPrice,
        },
      },
      
    ],
    application_context: {
      payment_method: {
        payer_selected: "PAYPAL",
        payee_preferred: "UNRESTRICTED",

         shipping_preference: requestShipping?"GET_FROM_FILE":"NO_SHIPPING"
    
        
          // shipping_preference: 'SET_PROVIDED_ADDRESS', // This sets the shipping address to the one provided by the buyer
          // shipping_preference: 'NO_SHIPPING',
          // address_override: '1', // Prevents PayPal from overriding the shipping address
        
     
      },
    },
  });

 return request;
}







const makePayment = async (req, res) => {
  console.log('  reqdata BITNO ~!!!~).', req.body)

  








let dbConnection;


  


  const resReturn = async(statusNumber, jsonObject)=>{

    res.status(statusNumber).json(jsonObject)
   
 }




  let totalPrice;

  let giftDiscount = false;







  const putInDatabase = async(paymentMethod,paymentId, approved=0, dbConnection) => {


      
async function generateUniqueId(dbConnection) {





  // Generate four random digits
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const characters = '0123456789';
 

  while (true) {

    const timestamp = Date.now().toString(16);

    const randomDigits = characters.charAt(Math.floor(Math.random() * characters.length));

  const uniqueId = randomDigits.substring(0, 2) + timestamp.substring(0, 4) + randomDigits.substring(2, 4) + timestamp.substring(4) + randomDigits.substring(4);



  if(  (  await dbConnection.query('SELECT 1 FROM orders WHERE id = ?', [uniqueId])   ).length<1  ) return uniqueId;

  
}

}


   


      
        




      

        const {
          
          firstName,
          lastName,
          address,
          apt,
          country,
          zipcode,
          state,
          city,
          phone,
          couponCode,
          tip,
          items,
          customerSubscribed,
          email
        } = req.body.order;


        console.log('order details right now,',  req.body.order)




        
        const customerInfo = (await dbConnection.query("SELECT id, JSON_CONTAINS(used_discounts, JSON_QUOTE(?), '$') as used_discount_exists FROM customers WHERE email = ? LIMIT 1", [couponCode,email]))[0];

        console.log('sooun checking', customerInfo);

        if(customerInfo?.used_discount_exists) return await resReturn(400, { success: false, error: "Discount has already been used." }, dbConnection);


        let customerId= customerInfo?.id;

        if(!customerId &&  email !== ""){

         
       

          const inserCustomerInfo = (await dbConnection.query(
            "INSERT INTO customers (email, totalOrderCount, subscribed, source) VALUES (?, ?, ?, ?)",
            [email, 0, 0, 'make_payment']
          ))?.[0];
          
          customerId = inserCustomerInfo?.insertId;


        }





        const uniqueId = await generateUniqueId(dbConnection);


        
      
        
        await dbConnection.query(
          `INSERT INTO orders (id, customer_id, firstName, lastName, address, apt, country, zipcode, state, city, phone, couponCode, tip, items, total, paymentMethod, paymentId, approved, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        , [
          uniqueId,
          customerId,
          firstName,
          lastName,
          address,
          apt,
          country,
          zipcode,
          state,
          city,
          phone,
          couponCode,
          tip,
          JSON.stringify(items),
          totalPrice,
          paymentMethod,
          paymentId,
          approved,
          Date.now(),
        ]
        );

      

      

        if(approved===1){


          
          console.log('its approved, sending thank you campaign and coupon code is', couponCode );

         

          await dbConnection.query("UPDATE customers SET totalOrderCount = totalOrderCount + 1, money_spent = ROUND(money_spent + ?, 2) WHERE id = ?", [totalPrice, customerId]); 

          if(couponCode!="")await dbConnection.query(`UPDATE customers SET used_discounts = JSON_ARRAY_APPEND(used_discounts, '$', ?) WHERE id = ? `, [couponCode,  customerId])



           
            
       
          await subscribe(email, customerSubscribed?"checkout":"checkout x",  {orderId:uniqueId}, dbConnection);

        

      
          


        giftDiscount= (await dbConnection.query(`SELECT 1 AS valid FROM customers WHERE id = ? AND totalOrderCount = 1`, [customerId]))[0]?.valid===1;
          
        

        }

      


  };





  try {


    
    dbConnection = await getPool().getConnection()


    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    

    // if (!(await limiterPerDay.rateLimiterGate(clientIp, dbConnection))){
      
      
    //   return await resReturn(429, { error: "Too many requests. Please try again later." });
    // }

    




    const {paymentMethod} = req.body;
    const { clientTotal, couponCode, tip, items } = req.body.order;


    const orderItems = (couponCode ? items : findBestBundleServer(items)).map(product => ({ 
      ...product, 
      price: product.bundledPrice || productsData.find(item => item.id === product.id)?.price || 0 
    }));
    console.log('items and orderItems', items, orderItems)
    
    totalPrice = 
      orderItems.reduce((sum, product) => 
        sum + product.price * product.quantity
      , 0).toFixed(2);
    
    const coupon = couponCode && coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    totalPrice = (totalPrice - (coupon ? ((totalPrice * coupon.discountPercentage) / 100).toFixed(2) : 0) + (parseFloat(tip) || 0)).toFixed(2);
    
    


    console.log('here are subtotal, tip and total price', orderItems,tip,totalPrice, clientTotal)

    if(clientTotal!==totalPrice)return await resReturn(400, { success: false, error: "Payment was not approved." });
   
    


    
    
    if(paymentMethod.includes('PAYPAL')){

      console.log('order ship info', req.body.order, req.body.paymentMethod)
    
      const requestShipping = (req.body.paymentMethod==='PAYPAL(EXPRESS)' &&  req.body.order.city==="" &&  req.body.order.address==="") || req.body.paymentMethod==='PAYPAL(INSTANT)';
    
    const request = await paypalPay(totalPrice, requestShipping);
  
    
    const response = await client.execute(request);
      console.log('Vidi response bato',response);
    // Check if the payment is approved
    if (response.result.status === "CREATED") {
     
      
     
      await putInDatabase(req.body.paymentMethod,response.result.id, 0 , dbConnection);

     
      return await resReturn(200, { success: true, paymentId: response.result.id });
    } else {
      // Payment was not successful


      return await resReturn(400, { success: false, error: "Payment was not approved." });

 
      

    }

  }




  else if(paymentMethod==='GPAY' ||  paymentMethod==='STRIPE'){


  //Namontirati gresku ako je drzava van dozvoljenih drzava




    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



    const paymentMethodId = paymentMethod==='GPAY'?(await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: req.body.paymentToken, // Google Pay token
      },
    })).id:req.body.stripeId;

    if(!paymentMethodId) throw new Error('Payment declined.')


      console.log('Proso stripe tokenizaciju', paymentMethod)


      const paymentIntent= await stripe.paymentIntents.create({
        amount: Math.round(totalPrice*100),
        currency: "USD",
        payment_method: paymentMethodId, // Google Pay token  
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        confirm: true
      });




      const dbPaymentMethod = paymentMethod==="GPAY"?'GPAY(STRIPE)':'STRIPE';





    await putInDatabase(dbPaymentMethod ,paymentIntent.client_secret, 1, dbConnection);
   

 
    
    

    return await resReturn(200, {
			
			success: true,
      giftDiscount: giftDiscount
		});







  }



  
  return await resReturn(500, {
			
    success: false, error: "Payment was not approved." 
  });

  


  } catch (error) {
    // Handle errors

    console.error("Error verifying payment:", error);

    return await resReturn(500, {
			
      success: false, error: "Payment was not approved." 
		});

    
  }

  finally{
    
    if(dbConnection)await dbConnection.release();
  }

};

export default makePayment;
