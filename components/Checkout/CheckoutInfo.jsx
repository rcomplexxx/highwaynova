import { useState,  useEffect, useCallback, useContext } from "react";
import styles from "./checkoutinfo.module.css";
import InputField from "./Input/InputField";
import CountryInput from "./Input/CountryInput/CountryInput";


import FloatingBadge from "./FloatingBadge/FloatingBadge";
import ExpressCheckout from "./ExpressCheckout/ExpressCheckout";
import Link from "next/link";
import PaymentSection from "./PaymentSection/PaymentSection";
import Tip from "./Tip/Tip";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import { CorrectIcon} from "@/public/images/svgs/svgImages";



export default function CheckoutInfo() {
  const [showApt, setShowApt] = useState(false);
  const [errors, setErrors] = useState({});
  // const [shippingType, setShippingType] = useState("free");

  const {cartProducts,  customerSubscribed, setCustomerSubscribed} = useContext(CheckoutContext);



   useEffect(()=>{
   const emailInput = document.getElementById("email");
    emailInput.readOnly = true;
    emailInput.focus();
    emailInput.readOnly = false;
   },[])

   useEffect(()=>{
    showApt && document.getElementById("apt").focus();
    }, [showApt]);





 

 





 

  return (
      <div className={styles.leftWrapper}>
        <div className={styles.checkout_left}>
          <ExpressCheckout/>



     
     
            <h2 className={styles.contactTitle}>Contact</h2>
          
            
            
                <InputField
                  id="email"
                  placeHolder="Email"
                  type="email"
                  
                  
                />
                 




                <div tabIndex={0} className={styles.emailSubscribeDiv} onClick={()=>{ setCustomerSubscribed(!customerSubscribed);}}>
      <div 
      className={`${styles.emailSubscribeChecker} ${customerSubscribed && styles.emailSubscribeCheckerChecked}`}>
        <CorrectIcon styleClassName={styles.checkImage}/>
      </div>
     
  
      <span className={styles.subscribeText}>
     Email me with news and offers
    </span>

    </div>










              <h2
                className={styles.deliveryTitle}
              >
                Delivery
              </h2>
           





              <div className={styles.inputFields}>





<CountryInput
                  id="country"
                  setErrors={setErrors}
                 
                  inputNumber={9}
                />


              <div className={styles.input_row}>
                <InputField
                  id="firstName"
                  placeHolder="First name"
                  type="text"
                  
                
                />
                <InputField
                  id="lastName"
                  placeHolder="Last name"
                  type="text"
                  
                />
              </div>
            
            
                <InputField
                  id="address"
                  placeHolder="Address"
                  type="text"
                  
                />
           
           


    { 
    showApt ? <InputField
                  id="apt"
                  placeHolder="Apartment, suite, etc. (Optional)"
                  type="text"
                />:<span onClick={()=>{setShowApt(true);}}
                
                className={styles.aptAdder}>+ Add apartment, suite etc.</span>
                }
            
            
              <div className={styles.input_row}>
              <InputField
                  id="city"
                  placeHolder="City"
                  type="text"
                  
                />
              
                <InputField
                  id="state"
                  placeHolder="State"
                  type="text"
                  
                />
                  <InputField
                  id="zipcode"
                  placeHolder="ZIP code"
                  type="text"
                  
                />
              </div>
            
            
              
                <InputField
                  id="phone"
                  placeHolder="Phone"
                  type="tel"
                  
                  children={<FloatingBadge message={'In case we need to contact you about your order'}/>}
                />
         
         
            
    
    



         </div>


         
         <PaymentSection />
                
                <Tip products={cartProducts} />
      

        </div>
        <div className={styles.checkoutFooterWrapper}>
                <div className={styles.checkoutFooter}>
                  <Link className={styles.footerLink} href='/refund-policy'>Refund policy</Link>
                  <Link className={styles.footerLink} href='/shipping-policy'>Shipping policy</Link>
                  <Link className={styles.footerLink} href='/privacy-policy'>Privacy policy</Link>
                  <Link className={styles.footerLink} href='/terms-of-service'>Terms of service</Link>
                </div>



                </div>
       
      </div>
 
  );
}

