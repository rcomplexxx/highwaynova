import  { useState } from "react";

import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from './paypal.module.css'
import { ErrorIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";


const PayPalButton=({checkFields, organizeUserData, method='paypal',  type='normal', color='blue'})=>{
  const [paypalError, setPaypalError] = useState();


  const router = useRouter();

  const setGiftDiscount = useGlobalStore(state =>  state.setGiftDiscount);

    const handlePayPalButtonClick =  async(data, actions) => {
      
        // if(type==='express') return actions.resolve();
        //Ako je type==express i address i city field vec provajdovan, mogu ici sa normal checkout.
        //Ako nije, i type=='express' ici sa epress checkut, tj zatraziti shipping od usera na paypal client

        setPaypalError();
    
        if(type=='instant' || (type==='express' && document.getElementById("address").value === "" && document.getElementById("city").value == "") )
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


      async function handlePayPalOrder(paymentMethod) {

        try {

          console.log('creating order');
          let requestData = organizeUserData(type=="normal"?"PAYPAL":(type=="express"?"PAYPAL(EXPRESS)":"PAYPAL(INSTANT)"));
          const discEle = document.getElementById("couponCode");
          if(discEle){
            console.log('discount exists', discEle.innerText)
            requestData={...requestData, order:{...requestData.order, couponCode: discEle.innerText}}
          }
          else{
            requestData={...requestData, order:{...requestData.order, couponCode: ""}}
          }

          const tipEl = document.getElementById("tipPrice");
         
          if (tipEl) {
           let tip = tipEl.innerText;
            tip = tip.substring(tip.indexOf("$") + 1).trim();
            requestData={...requestData, order:{...requestData.order, tip: tip}}
          }
          else{
            requestData={...requestData, order:{...requestData.order, tip: "0.00"}}
          }
          
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
          console.log("mail to be sent:" + document.getElementById("email").value);
        

     
          const response = await fetch("/api/approve-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentMethod: type=="normal"?"PAYPAL":(type=="express"?"PAYPAL(EXPRESS)":"PAYPAL(INSTANT)"),
              paymentId: data.orderID,
              customerSubscribed: document.getElementById('subscribeCheckbox')?.getAttribute('data-subscribe')
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
            const data = await response.json();
    
            if (data.error === "INSTRUMENT_DECLINED") {
              console.log(data.error);
              return actions.restart();
            } else {
              console.log(data.error);
              setPaypalError( data.error);
    
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

      return <></>;
      


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
              createOrder={async()=>{return await handlePayPalOrder('PAYPAL')}}
              style={{
                color: color,
                height: 48
              }}
              
              className={`${styles.paypalButton} ${type==="instant" && styles.instantPaypalButton}`}
            />
            {paypalError &&  <p className={styles.paypalError}><ErrorIcon/>{paypalError}</p>}
    </PayPalScriptProvider>

}

export default PayPalButton;