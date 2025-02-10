'use client'


import { useCallback, useContext, useRef, useState } from 'react';

import styles from './stripe.module.css'
import { useStripe,  CardNumberElement, CardCvcElement, CardExpiryElement} from "@stripe/react-stripe-js"

import FloatingBadge from '../FloatingBadge/FloatingBadge';
import { Elements, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from "next/router";
import BillingInfo from './BillingInfo/BillingInfo';
import swapCountryCode from '@/utils/utils-client/countryList';
import { CheckoutContext } from '@/contexts/CheckoutContext';
import InputField from '../Input/InputField';
import { CorrectIcon, ErrorIcon, Spinner} from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';
import { transformColorToRgb } from '@/utils/utils-client/transformColorToRgba';







export default function StripeWrapper({ checkFields}){
  const stripePromise = loadStripe('pk_test_51OR1EhAom3KfH7oBf5QRKboVHPrFIrZ3nwmtwS30uSDtrHbpgwsFzf19Np73RjxFiAqUy0tjPi5BIYdDmSPDExya00m4ZFZoI1');
  
  return (
    <Elements stripe={stripePromise}>
    <Stripe checkFields={checkFields}/>
    </Elements>
  );
  }





               

const Stripe = ({checkFields}) => {
    const [billingRequired, setBillingRequired] = useState(false);
    
    const [focusedField, setFocusedField]= useState();
    
    const [paymentProcessing, setPaymentProcessing]= useState(false);
    const [paymentProcessed, setPaymentProcessed] = useState(false);
    
    const [filledFields, setFilledFields] = useState({cardNumber:false, expiryDate:false, cvv:false})



    const [errors, setErrors] = useState({});
    const [stripeError, setStripeError]= useState();
   
    const errorhelperRef=useRef({});


    const router = useRouter();



    const {organizeUserData} = useContext(CheckoutContext);

    const setGiftDiscount = useGlobalStore(state =>  state.setGiftDiscount);

    
    const stripe = useStripe();
    const elements= useElements();

  


    

    const getInputColor =  useCallback(()=>{
      const color =  getComputedStyle(document.documentElement).getPropertyValue('--checkout-input-color');
      return transformColorToRgb(color);
    },[])


    const getInputBgColor = useCallback(()=>{
      const color =  getComputedStyle(document.documentElement).getPropertyValue('--checkout-input-bg');
      return transformColorToRgb(color);
    },[])
 
  
   
   
 
    

 


const handleStripePay= async(event)=>{
 
  event.preventDefault();
  if(paymentProcessing)return;

  
  setPaymentProcessing(true);
  setStripeError();



  const cardErrors = { ...errors };

  if (!filledFields.cardNumber) cardErrors.cardNumber = "Enter a valid card number";
  else if (!filledFields.expiryDate) cardErrors.expiryDate = "Enter a valid expiry date";
  else if (!filledFields.cvv) cardErrors.cvv = "Enter a valid security number";
  

  
  
  
  
  if(!checkFields({method:'stripe', billingRequired, cardErrors, setCardErrors: setErrors})){
    return setPaymentProcessing(false);
  }
  

  

  
  

  const cardElement = elements.getElement(CardNumberElement);

  const requestData = organizeUserData('STRIPE');

  
  

  



 
  let billingAddress, billingApt, billingCountry, billingZipcode, billingState, billingCity, billingPhone;

  if (!billingRequired) {
    const { address, apt, country, zipcode, state, city, phone } = requestData.order;
    billingAddress = address;
    billingApt = apt || null;
    billingCountry = country;
    billingZipcode = zipcode;
    billingState = state;
    billingCity = city;
    billingPhone = phone || null;
  } else {
    const getValue = (id) => document.getElementById(id)?.value || "";
    billingAddress = getValue("billingAddress");
    billingApt = getValue("billingApt") || null;
    billingCountry = swapCountryCode(getValue("billingCountry"));
    billingZipcode = getValue("billingZipcode");
    billingState = getValue("billingState");
    billingCity = getValue("billingCity");
    billingPhone = getValue("billingPhone") || null;
  }

    
  const cardHolderName = document.getElementById("cardHolderName").value;



      const {error: transactionError, paymentMethod: transactionPaymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
          name: cardHolderName,
          email: requestData.order.email,
          address: {
            line1: billingAddress,
            line2: billingApt,
            city: billingCity,
            state: billingState,
            postal_code: billingZipcode,
            country: billingCountry
          },
          phone:  billingPhone
      }
  });



       


  if (!transactionError) {

    
    try {
      const { id } = transactionPaymentMethod;
      const response = await fetch("/api/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestData, stripeId: id }),
      });
      const data = await response.json();
      console.log('rp', data);
  
      if (data.success) {
        console.log('pay success');
        setGiftDiscount(data.giftDiscount);
        setPaymentProcessed(true);
        setTimeout(() => router.push("/thank-you"), 500);
      } else {
        setStripeError({ stripeServerError: data.error });
   
        
        //Ovde izbaci gresku
              // setStripeError({stripeServerError: 'Error occured. Payment was not processed.'})
      }
    } catch (error) {
        
            console.log('stripe error',error)
            setStripeError({stripeServerError: 'Error occured. Payment was not processed.'});
          }

          finally {
            setPaymentProcessing(false);
          }



      } else {

        
        
        if(transactionError.code==='incomplete_number' || transactionError.code==='invalid_number')setErrors({...errors,cardNumber:'Enter a valid card number'})
        else if( transactionError.code === 'incomplete_expiry') setErrors({...errors,expiryDate:'Enter a valid exipry date'})
        else if( transactionError.code === 'incomplete_cvc') setErrors({...errors,cvv:'Enter a valid security code'})
        else if( transactionError.code === 'incorrect_address' || transactionError.code === "account_number_invalid") 
      setStripeError('Billing address invalid. Please check provided information.')
       else setStripeError({stripeServerError: 'Error occured. Payment was not processed.'});
        setPaymentProcessing(false);
        // Enter your name exactly as it’s written on your card

        
       errorhelperRef.current={...errors};
      }




}

const handleCCChange=   (event) => {

  
  const stripeField= event.elementType==='cardNumber'?'cardNumber':(event.elementType==='cardExpiry'?'expiryDate':'cvv')
 
  setErrors({...errors, [stripeField]: undefined});


  
  
  errorhelperRef.current[stripeField]=(!event.complete || event.error || event.empty) && `Enter a valid ${stripeField==='cardNumber'?'card number':(stripeField==='expiryDate'?'expiry date':'security number')}`;

  setFilledFields({...filledFields, [stripeField]: !event.empty})

  
 
  
};

const handleCCBlur = () => {
  setErrors({ ...errors, [focusedField]: errorhelperRef.current[focusedField] });
  setFocusedField();
};
  
    

  return (
    <div className={styles.creditCardForm}>
    
    
    <div className={styles.ccInputRow}>



    <StripeCardWrapper label={{text:'Card number', floating:filledFields.cardNumber}} error  = {errors.cardNumber}>
    <CardNumberElement
    onBlur={handleCCBlur}
    onChange={handleCCChange}
    onFocus={()=>{
      setFocusedField('cardNumber');
      
    
      }}
    options={{placeholder:'',  style: {
      base: {
        color: getInputColor(),
        backgroundColor:getInputBgColor(),
        lineHeight:"64px",
      },
    
     
      invalid: {
        color: getInputColor()
      }
    }}}
        className={`${styles.input_field} ${errors.cardNumber && styles.input_error} ${focusedField==='cardNumber' && styles.stripeFieldFocused}`}
      /> 
      <FloatingBadge makeLockBadge={true}/>
      
      

      </StripeCardWrapper>


{/* defaultValues */}
{/* https://stripe.com/docs/js/elements_object/create_payment_element#payment_element_create-options */}



     
</div>
      <div className={styles.ccInputRow}>



      <StripeCardWrapper  label={{text:'Expiration Date (MM / YY)', floating:filledFields.expiryDate}} error={errors.expiryDate}>
      <CardExpiryElement id="expiryDate"
 onBlur={handleCCBlur}
 onFocus={()=>{
  setFocusedField('expiryDate');
  
  }}
 onChange={handleCCChange}
      options={{placeholder:'',  style: {
        base: {
          color: getInputColor(),
          backgroundColor:getInputBgColor(),
          lineHeight:"64px",
        },
        invalid: {
          color: getInputColor()
        }
      }}}
      className={`${styles.input_field} ${errors.expiryDate && styles.input_error} ${focusedField==='expiryDate' && styles.stripeFieldFocused}`}
    />

    
    
   
      </StripeCardWrapper>




  
  <StripeCardWrapper   label={{text:'Security code', floating:filledFields.cvv}}  error  = {errors.cvv}>

  <CardCvcElement  id="cvv" 
   onBlur={handleCCBlur}
   onChange={handleCCChange}
  onFocus={()=>{
    setFocusedField('cvv');
    
  }}
   options={{placeholder:'',  style: {
    base: {
      color: getInputColor(),
      backgroundColor: getInputBgColor(),
      lineHeight:"64px",
    },
    invalid: {
      color: getInputColor()
    }
  }}}
  className={`${styles.input_field} ${errors.cvv && styles.input_error} ${focusedField==='cvv' && styles.stripeFieldFocused}`}/>
  <FloatingBadge message={'3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front.'}/>
  
  

  </StripeCardWrapper> 

</div>
       
<div className={`${styles.ccInputRow} ${styles.lastCcInputRow}`}>


<InputField
       id="cardHolderName"
       placeHolder='Name on card'
          type="text"
          
     
          

          
        />
      </div>


      <div tabIndex={0} className={styles.billingCheckboxDiv} onClick={()=>{setBillingRequired(!billingRequired)}}>
      <div id="billingRequired" className={`${styles.addressTypeChecker} ${!billingRequired && styles.addressTypeCheckerChecked}`} 
     
      >
        <CorrectIcon styleClassName={styles.addressCheckerImage}/>
        </div>
      <span className={styles.billingCheckboxLabel}>
      Use shipping address as billing address
    </span>
    </div>


  <BillingInfo isOpen={billingRequired} />






    <button className={`${styles.payNowButton} ${(paymentProcessed || paymentProcessing) && styles.payNowButtonPaying}`} 
    onClick={handleStripePay}>{
      paymentProcessed?<CorrectIcon styleClassName={styles.correctIcon}/>:
    paymentProcessing?
    <Spinner/>
    :"Pay now"}</button>


    {stripeError?.stripeServerError && <span className={styles.paymentError}><ErrorIcon/>{stripeError.stripeServerError}</span>}
    </div>
  );
};



const StripeCardWrapper = ({label, error, children}) =>{


  return <div className={styles.form_group}>

  <div className={styles.inputWrapper}>

    {children}

   
    <span className={`${styles.label} ${label.floating && styles.floatingLabel}`}>{label.text}</span>

  </div>

{error && <span className={styles.stripeError}><ErrorIcon/>{error}</span>}


</div>

}



