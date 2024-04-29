import paypal from "@paypal/checkout-server-sdk";
import Stripe from 'stripe';
import productsData from "../../data/products.json";
import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";
import coupons from '../../data/coupons.json'
import subscribe from '@/utils/subcsribe.js'

const limiterPerDay = new RateLimiter({
  apiNumberArg: 2,
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

const paypalPay=async(totalPrice)=>{
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
     
    
        
          // shipping_preference: 'SET_PROVIDED_ADDRESS', // This sets the shipping address to the one provided by the buyer
          // shipping_preference: 'NO_SHIPPING',
          // address_override: '1', // Prevents PayPal from overriding the shipping address
        
     
      },
    },
  });

 return request;
}




function generateUniqueId() {
  // Get current timestamp in milliseconds
  const timestamp = Date.now().toString(16);

  // Generate four random digits
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
  const randomDigits = characters.charAt(Math.floor(Math.random() * characters.length));

  // Insert random digits at specified positions
  const uniqueId = randomDigits.substring(0, 2) + timestamp.substring(0, 4) + randomDigits.substring(2, 4) + timestamp.substring(4) + randomDigits.substring(4);

  return uniqueId;
}



const makePayment = async (req, res) => {
  console.log('  reqdata BITNO ~!!!~).', req.body)

  const putInDatabase = (paymentMethod,paymentId, approved=0) => {
    return new Promise((resolve, reject) => {
      try {
        const db = betterSqlite3(process.env.DB_PATH);
        //  db.prepare(`DROP TABLE IF EXISTS orders`).run();
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            email TEXT,
            firstName TEXT,
            lastName TEXT,
            address TEXT,
            apt TEXT,
            country TEXT,
            zipcode TEXT,
            state TEXT,
            city TEXT,
            phone TEXT,
            couponCode TEXT,
            tip TEXT,
            items TEXT,
            paymentMethod TEXT,
            paymentId TEXT,
            packageStatus TEXT,
            approved BOOLEAN,
            createdDate INTEGER
          )
        `,
        ).run();

        const {
          email,
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
        } = req.body.order;
        console.log(' and items!!!!!!!!!',  items);
      

        db.prepare(
          `INSERT INTO orders (id, email, firstName, lastName, address, apt, country, zipcode, state, city, phone, couponCode, tip, items, paymentMethod, paymentId, packageStatus, approved, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0', ?, ?)`,
        ).run(
          generateUniqueId(),
          email,
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
          paymentMethod,
          paymentId,
          approved,
          Math.floor(Date.now() / 86400000),
        );

       
        if(req.body.order.subscribe)
        subscribe(email, "checkout");
      else subscribe(email, "checkout x");
        

        db.close();
        resolve("Order placed successfully.");
      } catch (error) {
        console.error("Error in database operations:", error);
        reject("Error in database operations.");
      }
    });
  };

  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!(await limiterPerDay.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });
    console.log('ITEMS', req.body.order.items)
    let totalPrice = req.body.order.items
      .reduce((sum, product) => {
        const productInfo = productsData.find((item) => item.id === product.id);
        if (productInfo) {
          sum += productInfo.price * product.quantity;
        }

        return sum;
      }, 0)
      .toFixed(2);

    console.log('TOTALPRICE!',totalPrice);
    const couponCode = req.body.order.couponCode;
    console.log('discount code is!', couponCode)
    if (couponCode != "") {
      const coupon= coupons.find((c)=>{return c.code.toUpperCase()===couponCode.toUpperCase()});
      console.log('coupon is!', coupon);
      if(coupon){
      const discount= coupon.discountPercentage;
      const discountFloat = parseFloat(discount);

      totalPrice = totalPrice - totalPrice*discountFloat/100;
      totalPrice= totalPrice.toFixed(2);
      }

    }

    const tip =req.body.order.tip;
      if (tip && tip!="" && tip!="0") {
      
        const tipFloat = parseFloat(tip);
  
        totalPrice = parseFloat(totalPrice) + tipFloat;
        totalPrice= totalPrice.toFixed(2);
        }
    console.log('Total price on server is', totalPrice)
    console.log('tip je:', req.body.order.tip);
    
    if(req.body.paymentMethod.includes('PAYPAL')){
      console.log('popusis ti meni',req.body.paymentMethod)
    const request = await paypalPay(totalPrice);
    console.log('popusen request', request)
    const response = await client.execute(request);
      console.log('Vidi response bato',response);
    // Check if the payment is approved
    if (response.result.status === "CREATED") {
      console.log('status je creacted')
      await putInDatabase(req.body.paymentMethod,response.result.id);
      res.status(200).json({ success: true, paymentId: response.result.id });
    } else {
      // Payment was not successful
      res
        .status(400)
        .json({ success: false, error: "Payment was not approved." });
    }

  }
  else if(req.body.paymentMethod==='GPAY'){
    // const tokenValid= await validateToken(req.body.paymentToken)
    // if(tokenValid) res.status(200).json({ success: true, message:'Token validated' });
    // else {
    //   res
    //   .status(400)
    //   .json({ success: false, error: "Payment was not approved." });
    // }
    // await putInDatabase('GPAY',response.result.id);
 
   
    const amount= req.body.amount;
    
    if(amount!= totalPrice)
    return res
      .status(400)
      .json({ success: false, error: "amount_incorrect" });

      //Namontirati gresku ako je drzava van dozvoljenih drzava


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: req.body.paymentToken, // Google Pay token
      },
    });

    console.log('Proso stripe tokenizaciju')
    console.log('amount je', amount);

    const paymentIntent= await stripe.paymentIntents.create({
			amount:parseInt(amount*100),
			currency: "USD",
      payment_method: paymentMethod.id, // Google Pay token
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
		});
    await putInDatabase('GPAY(STRIPE)',paymentIntent.client_secret, 1);

  	return res.json({
			
			success: true
		})






  }

  //check amount?
  else if(req.body.paymentMethod==='STRIPE'){
   
    // stripeId amount totalPrice
    console.log('popusis ti meni STRIPE')
    const {stripeId} = req.body;
 

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
    const paymentIntent = await stripe.paymentIntents.create({
      amount:parseInt(totalPrice*100),
			currency: "USD",
      payment_method: stripeId, 
			automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
      },
      confirm: true
		});

    // billing_details: {
    //   name: 'John Doe',
    //   email: 'john.doe@example.com',
    //   address: {
    //     line1: '123 Main Street',
    //     city: 'Anytown',
    //     postal_code: '12345',
    //     country: 'US',
    //   },
    // },

    
		console.log("Payment client Secret", paymentIntent.client_secret)
    await putInDatabase('STRIPE',paymentIntent.client_secret, 1);
		return res.json({
			
			success: true
		})

  }
  

console.log('jos napreduje');


  } catch (error) {
    // Handle errors

    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: "Error occured. Payment was not approved." });
  }
};

export default makePayment;
