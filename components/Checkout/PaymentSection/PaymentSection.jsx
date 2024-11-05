import { useEffect, useRef, useState } from "react";
import PayPalButton from "../ExpressCheckout/PayPal/PayPal";
import StripeWrapper from "../Stripe/Stripe";
import styles from "./paymentmethodwrapper.module.css";
import Image from "next/image";
import {Amex, Discover, Jcb, MasterCard, UntionPay, Visa} from '@/public/images/svgs/svgImages.jsx'

export default function PaymentSection({ checkFields }) {
    const [paymentMethod, setPaymentMethod] = useState("creditcard");
    
    const [allowMoreCardsPopup, setAllowMoreCardsPopup] = useState(true);
    
    const maxHeightTimoutAdj = useRef();
    
    const mounted= useRef(false);
    const lastSelectedPaymentRef = useRef();
    const creditCardPaymentFieldsRef = useRef();
    const paypalPaymentFieldsRef = useRef();
    const blockNextMoreCardsMobileClick = useRef(true);

    const moreCardsDivRef = useRef();

    
  useEffect(()=>{
   
    if(!mounted.current){
      lastSelectedPaymentRef.current= creditCardPaymentFieldsRef.current;
      lastSelectedPaymentRef.current.style.overflow = `visible`
      mounted.current=true;
      return;
    }
    clearTimeout(maxHeightTimoutAdj.current);
   

    let selectedPaymentFields;
    let nonSelectedPaymentFields;


    if(paymentMethod==='creditcard') selectedPaymentFields = creditCardPaymentFieldsRef.current;
    else if(paymentMethod==='paypal')selectedPaymentFields = paypalPaymentFieldsRef.current;
  




  nonSelectedPaymentFields=  lastSelectedPaymentRef.current;


 
    selectedPaymentFields.style.maxHeight=`${selectedPaymentFields.scrollHeight}px`;

    nonSelectedPaymentFields.style.transition=`max-height 0s ease`;
    nonSelectedPaymentFields.style.overflow=`hidden`;
    nonSelectedPaymentFields.style.maxHeight=`${nonSelectedPaymentFields.scrollHeight}px`;
    setTimeout(()=>{
      nonSelectedPaymentFields.style.transition=`max-height 0.6s ease`;
      nonSelectedPaymentFields.style.maxHeight=`0`;
     }, 1)
   
     maxHeightTimoutAdj.current=setTimeout(()=>{
      selectedPaymentFields.style.maxHeight=`none`;
      selectedPaymentFields.style.overflow = `visible`
     }, 600);

     lastSelectedPaymentRef.current= selectedPaymentFields;
  


  },[paymentMethod]);







  
  


  return (
    <div className={styles.paymentFieldsDiv}>
      <h2 className={styles.paymentTitle}>Payment</h2>
      <span className={styles.paymentNotification}>
        All transactions are secure and encrypted.
      </span>

      <div className={styles.mainWrapper}>
       
      
        <div className={`${styles.paymentOptionDiv} ${paymentMethod==="creditcard" && styles.selectedOption}`} 
        onClick={(event)=>{if(!moreCardsDivRef.current.contains(event.target))setPaymentMethod("creditcard")}}>
           
           
           <div className={styles.pickOption}>
            <div className={`${styles.pickCheck} ${paymentMethod==="creditcard" && styles.pickCheckSelected}`}>
                <div className={`${paymentMethod==="creditcard" && styles.ringEffectDiv}`}/>
            </div>
            <span className={styles.optionSpan}>Credit Card</span>
           </div>


           <div className={styles.CCSolutions}>
            <Visa styleClassName={styles.creditCardLogo}/>
            <MasterCard styleClassName={styles.creditCardLogo}/>
            <Amex styleClassName={`${styles.creditCardLogo} ${styles.lastInLineCard}`}/>
           
            <div ref={moreCardsDivRef} className={styles.moreCards} 
         
            onMouseLeave={()=>{ blockNextMoreCardsMobileClick.current= true;setAllowMoreCardsPopup(true) }}
          
            onClick={(event)=>{ if(!window.matchMedia('(pointer: fine)').matches && blockNextMoreCardsMobileClick.current) blockNextMoreCardsMobileClick.current=false;
              else setAllowMoreCardsPopup(!allowMoreCardsPopup);}}
           
           >
           
           
           
            <div className={`${styles.moreCardsPopupWrapper} ${allowMoreCardsPopup && styles.moreCardsPopupOpen}`}>
            <div className={styles.moreCardsPopup}>
            <Amex styleClassName={`${styles.creditCardLogo} ${styles.firstCloudCard}`}/>
            <Discover styleClassName={styles.creditCardLogo}/>
            <Jcb styleClassName={styles.creditCardLogo}/>
            <UntionPay styleClassName={styles.creditCardLogo}/>
            </div>
            <div className={styles.moreCardsPopupTriangle}/>
            </div>
            
            </div>
            
           </div>
        </div>


        <div id='creditCardFields' ref={creditCardPaymentFieldsRef}  className={`${styles.paymentFields} ${styles.creditCardField} 
        ${paymentMethod==="creditcard" && styles.selectedField}`}>
            <div className={styles.paymentFieldsSpaceAdjuster}> 
          <StripeWrapper
       
       
       
            checkFields={checkFields}
          />
          </div>
        </div>






        <div className={`${styles.paymentOptionDiv} ${styles.lastPaymentOptionField} ${paymentMethod==="paypal" && `${styles.selectedOption} ${styles.lastOptionSelected}`}`} onClick={()=>{setPaymentMethod("paypal")}} >


           <div className={styles.pickOption}>
            <div className={`${styles.pickCheck} ${paymentMethod==="paypal" && styles.pickCheckSelected}`}>
                <div className={`${paymentMethod==="paypal" && styles.ringEffectDiv}`}/>
            </div>
            <span>Paypal</span>
           </div>


           <Image src={'/images/paypalTextLogo2.png'} alt={`paypal logo`} className={styles.paypalLogo} height={24} width={96} />
        </div>

        

        <div id='paypalFields' ref={paypalPaymentFieldsRef} 
        className={`${styles.paymentFields} ${styles.paypalField} ${paymentMethod==="paypal" && styles.selectedField}`}>
       
        <div className={styles.paypalFieldWrapper}>
          <PayPalButton
            checkFields={checkFields}
            
        
            
           
            
          />
         
        </div>  
        
        </div>


      </div>
      </div>
  );
}
