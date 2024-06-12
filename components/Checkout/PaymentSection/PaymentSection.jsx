import { useEffect, useRef, useState } from "react";
import PayPalButton from "../PayPal/PayPal";
import StripeWrapper from "../Stripe/Stripe";
import styles from "./paymentmethodwrapper.module.css";
import Image from "next/image";
import {Amex, Discover, Jcb, MasterCard, UntionPay, Visa} from '@/public/images/svgs/svgImages.jsx'

export default function PaymentSection({ checkFields, organizeUserData, setErrors, products,setCartProducts}) {
    const [paymentMethod, setPaymentMethod] = useState("creditcard");
    const [moreCardsPopupOpen, setMoreCardsPopupOpen] = useState(false);
    
    const maxHeightTimoutAdj = useRef();
    const moreCardsPopupRef = useRef();
    const mounted= useRef(false);
    const lastSelectedPaymentRef = useRef();
    const creditCardPaymentFieldsRef = useRef();
    const paypalPaymentFieldsRef = useRef();


    
  useEffect(()=>{
   
    if(!mounted.current){
      lastSelectedPaymentRef.current= creditCardPaymentFieldsRef.current;
      
      mounted.current=true;
      return;
    }
    clearTimeout(maxHeightTimoutAdj.current);
   

    let selectedPaymentFields;
    let nonSelectedPaymentFields;


    if(paymentMethod=='creditcard') selectedPaymentFields = creditCardPaymentFieldsRef.current;
    else if(paymentMethod=='paypal')selectedPaymentFields = paypalPaymentFieldsRef.current;
  




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







  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreCardsPopupRef.current && !moreCardsPopupRef.current.contains(event.target)) {
        // Clicked outside the floating div, so close the dialog
        setMoreCardsPopupOpen(false);
      }
    };

    if(moreCardsPopupOpen){
      document.addEventListener('click', handleClickOutside);
    }
    else{
      document.removeEventListener('click', handleClickOutside);
    }

  

    return () => {
      if(moreCardsPopupOpen) document.removeEventListener('click', handleClickOutside);
    };
  }, [moreCardsPopupOpen]);


  


  return (
    <>
      <h2 className={styles.paymentTitle}>Payment</h2>
      <p className={styles.paymentNotification}>
        All transactions are secure and encrypted.
      </p>

      <div className={styles.mainWrapper}>
       
      
        <div className={`${styles.paymentOptionDiv} ${paymentMethod=="creditcard" && styles.selectedOption}`} 
        onClick={(event)=>{if(!document.getElementById("moreCards")?.contains(event.target))setPaymentMethod("creditcard")}}>
           
           
           <div className={styles.pickOption}>
            <div className={`${styles.pickCheck} ${paymentMethod=="creditcard" && styles.pickCheckSelected}`}>
                <div className={`${paymentMethod=="creditcard" && styles.ringEffectDiv}`}/>
            </div>
            <span className={styles.optionSpan}>Credit Card</span>
           </div>


           <div className={styles.CCSolutions}>
            <Visa styleClassName={styles.creditCardLogo}/>
            <MasterCard styleClassName={styles.creditCardLogo}/>
            <Amex styleClassName={`${styles.creditCardLogo} ${styles.lastInLineCard}`}/>
           
            <div id="moreCards" className={styles.moreCards} onMouseEnter={()=>{if(window.matchMedia('(pointer: fine)').matches) setMoreCardsPopupOpen(true)}}
            onMouseLeave={()=>{if(window.matchMedia('(pointer: fine)').matches) setMoreCardsPopupOpen(false)}}
            onClick={(event)=>{  if(!moreCardsPopupOpen)moreCardsPopupRef.current=event.target; setMoreCardsPopupOpen(!moreCardsPopupOpen)}}
            >
           
           
           
            <div className={`${styles.moreCardsPopupWrapper} ${moreCardsPopupOpen && styles.moreCardsPopupOpen}`}>
            <div onClick={(event)=>{event.stopPropagation();setMoreCardsPopupOpen(false);}} className={styles.moreCardsPopup}>
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
        ${paymentMethod=="creditcard" && styles.selectedField}`}>
            <div className={styles.paymentFieldsSpaceAdjuster}> 
          <StripeWrapper
            setCartProducts={setCartProducts}
            products={products}
            organizeUserData={organizeUserData}
            checkFields={checkFields}
          />
          </div>
        </div>






        <div className={`${styles.paymentOptionDiv} ${paymentMethod=="paypal" && styles.selectedOption}`} onClick={()=>{setPaymentMethod("paypal")}} >


           <div className={styles.pickOption}>
            <div className={`${styles.pickCheck} ${paymentMethod=="paypal" && styles.pickCheckSelected}`}>
                <div className={`${paymentMethod=="paypal" && styles.ringEffectDiv}`}/>
            </div>
            <span>Paypal</span>
           </div>


           <Image src={'/images/paypalTextLogo2.png'} alt={`paypal logo`} className={styles.paypalLogo} height={24} width={96} />
        </div>

        

        <div id='paypalFields' ref={paypalPaymentFieldsRef} 
        className={`${styles.paymentFields} ${styles.paypalField} ${paymentMethod=="paypal" && styles.selectedField}`}>
       
        <div className={styles.paypalFieldWrapper}>
          <PayPalButton
            checkFields={checkFields}
            organizeUserData={organizeUserData}
            method="paypal"
            setCartProducts={setCartProducts}
            setErrors={setErrors}
          />
         
        </div>  
        
        </div>


      </div>
    </>
  );
}
