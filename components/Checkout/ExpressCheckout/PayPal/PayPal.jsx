import  { useContext, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from './paypal.module.css'
import { ErrorIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";
import { CheckoutContext } from "@/contexts/CheckoutContext";


const PayPalButton=({checkFields, organizeUserDataArg, method='paypal',  type='normal', color='blue'})=>{
  const [paypalError, setPaypalError] = useState();


  

const {organizeUserData, customerSubscribed} = useContext(CheckoutContext);




const organizeUserDataRef = useRef(organizeUserData);
const customerSubscribedRef = useRef(customerSubscribed);



  useEffect(()=>{
    if(organizeUserData)
    organizeUserDataRef.current = organizeUserData;

    else organizeUserDataRef.current = organizeUserDataArg;

    customerSubscribedRef.current = customerSubscribed;

  },[organizeUserData, organizeUserDataArg, customerSubscribed])





  const router = useRouter();

  const setGiftDiscount = useGlobalStore(state =>  state.setGiftDiscount);

    const handlePayPalButtonClick =  async(data, actions) => {
      
        // if(type==='express') return actions.resolve();
        //Ako je type==express i address i city field vec provajdovan, mogu ici sa normal checkout.
        //Ako nije, i type=='express' ici sa epress checkut, tj zatraziti shipping od usera na paypal client

        setPaypalError();
    
        if(type==='instant' || (type==='express' && document.getElementById("address").value === "" && document.getElementById("city").value == "") )
        return actions.resolve();
        try {
          const fieldsCorrect=checkFields();

            if(!fieldsCorrect) return actions.reject();
          else return actions.resolve();
        

          
        } catch (error) {
          console.log(error);
          return actions.reject();
        }
      };


      async function handlePayPalOrder() {

        try {

          console.log('creating order');


          let requestData = organizeUserDataRef.current(type=="normal"?"PAYPAL":(type=="express"?"PAYPAL(EXPRESS)":"PAYPAL(INSTANT)"));



          console.log('here is req data', requestData)
        
          
         

          

          
            const response = await fetch("/api/make-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });
        
            const order = await response.json();
        
            if (order.success) {
              console.log("order id returned", order.paymentId);
              return order.paymentId;
            } else {
              console.log('myor', order);
              setPaypalError(order.error)
              return;
            }
          } catch (error) {
            console.log('myerr', error);
            setPaypalError('Error occured. Payment was not processed.')
            
          }
        
      }






      const handlePayPalButtonApprove = async (data, actions) => {
        try {
        
          
        
          console.log('customerSubscribed',customerSubscribedRef.current);
          

     
          const response = await fetch("/api/approve-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentMethod: type=="normal"?"PAYPAL":(type=="express"?"PAYPAL(EXPRESS)":"PAYPAL(INSTANT)"),
              paymentId: data.orderID,
              customerSubscribed: customerSubscribedRef.current
            }),
          });
          // Parse the JSON response
    
          if (response.ok) {
            console.log("Payment was successful");
            // Handle successful payment logic here
            const data = await response.json();
            
           
            setGiftDiscount(data.giftDiscount);
            
            router.push("/thank-you");
          } else {
            const {error} = await response.json();
    
            if (error === "INSTRUMENT_DECLINED") {
              console.log(error);
              return actions.restart();
            } else {
              console.log(error);
              setPaypalError(error);
    
              // Handle other payment errors here
            }
          }
        } catch (error) {
          console.error("Error capturing payment:", error);
          // Handle fetch or other errors here
        }
    
        // Payment was successful
      };

      const cancelHandler = async () => { setPaypalError('Payment is canceled.') };

      
      


    return  <PayPalScriptProvider
    options={{
      "client-id":"test",
       
    }}
  >

{/* "AQB3vOguzerJ-HXgJavEAMlivjs3DTNyWi2W7yKI94arI23zXOAaSJx4Zf4JzTO9RjvJdr5AflrFHWp1", */}
      <PayPalButtons
              fundingSource={`${method}`}
              onClick={handlePayPalButtonClick}
              onApprove={handlePayPalButtonApprove}
              onCancel={cancelHandler}
              createOrder={handlePayPalOrder}
              style={{
                color: color,
                height: 48
              }}
              
              
              className={`${styles.paypalButton} ${type==="instant" && styles.instantPaypalButton}`}
            />
            {paypalError &&  <p className={`${styles.paypalError} ${type === "instant" && styles.instantPaypalError}`}><ErrorIcon/>{paypalError}</p>}
    </PayPalScriptProvider>

}

export default PayPalButton;