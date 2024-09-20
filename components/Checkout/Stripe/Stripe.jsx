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
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
    const [billingErrors, setBillingErrors]= useState({});
    const [focusedField, setFocusedField]= useState();
    const [paymentProcessing, setPaymentProcessing]= useState(false);
    const [paymentProcessed, setPaymentProcessed] = useState(false);
    const [cardHolderName, setCardHolderName]= useState('');
    const [nonEmptyFields, setNonEmptyFields] = useState({cardNumber:false, expiryDate:false, cvv:false})
   
    
    const [stripeError, setStripeError]= useState();
    const [errors, setErrors] = useState({});
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
 
  
   
   
    const checkBillingFields=()=>{

      if(billingAddressSameAsShipping)return true;


      const testBillingErrors = ()=>{

      

      let newErrors = {};
      // if(document.getElementById('email').value==='') return actions.reject();
      const testId = (id) => {
        if (document.getElementById(id).value === "") {
          newErrors = { ...newErrors, [id]: `${id} is a required field.` };
          return newErrors;
        }
      };
  
      if (document.getElementById("billingEmail").value === "") {
        newErrors = { ...newErrors, billingEmail: "Email is a required field." };
        return newErrors;
      }
      if (
        !/^\S{3,}@\S{3,}\.\S{2,}$/.test(document.getElementById("billingEmail").value)
      ) {
        newErrors = {
          ...newErrors,
          billingEmail: "Please enter a valid email address.",
        };
      }
    
  
     
      testId("billingAddress");
      testId("billingCountry");
      testId("billingZipcode");
      testId("billingState");
      testId("billingCity");
  
      const phone = document.getElementById("billingPhone").value; //
      if (phone.length < 5){
        newErrors = { ...newErrors, phone: "Invalid phone" };
        return newErrors;
    }
      else {
        for (let i = 0; i < phone.length; i++) {
          const char = phone[i];
          if (
            !(
              (char >= "0" && char <= "9") ||
              ["+", "-", "(", ")", " ", ".", "/"].includes(char)
            )
          ) {
            newErrors = { ...newErrors, phone: "Invalid phone" };
            return newErrors;
          }
        }
      }
  
      return newErrors;

    }

    const billingError = testBillingErrors();
    setBillingErrors(billingError);
  
      const errorsExist=Object.keys(billingError).length !== 0;
      console.log('errorsExist?', errorsExist)
      if (errorsExist) {
        window.scrollTo({
          top:
            document
              .getElementById(Object.keys(billingError)[0])
              .getBoundingClientRect().top +
            window.scrollY -
            12,
          behavior: "smooth",
        });
  
     
    }
  
    return !errorsExist;
  }

 


const handleStripePay= async(event)=>{
 
  event.preventDefault();
  if(paymentProcessing)return;

  console.log('billErr', billingErrors);
  setPaymentProcessing(true);
  setStripeError();

  
 
  
  
  
  
  if(!checkFields()){
    setPaymentProcessing(false);return;
  }
  

  

  const clickPass= !errors.cardNumber && !errors.expiryDate && !errors.cvv && !errors.cardHolderName ;
 
  if(!clickPass) { setPaymentProcessing(false);return;}

  if(!nonEmptyFields.cardNumber){
    setErrors({...errors, cardNumber:"Enter a valid card number"});
    setPaymentProcessing(false);
    return;

  }
  if(!nonEmptyFields.expiryDate){
    setErrors({...errors, expiryDate:"Enter a valid expiry date"});
    setPaymentProcessing(false);
    return;

  }

  if(!nonEmptyFields.cvv){
    setErrors({...errors, cvv:"Enter a valid security number"});
    setPaymentProcessing(false);
    return;

  }

  if(cardHolderName ===""){
    setErrors({...errors, cardHolderName:"Enter a valid card name"});
    setPaymentProcessing(false);
    return;
   }

  if(!checkBillingFields()){setPaymentProcessing(false);return;}

  const cardElement = elements.getElement(CardNumberElement);

  const requestData = organizeUserData('STRIPE');

  
  console.log('THE BILLING FUCKING DATA!',requestData);

  let transactionError, transactionPaymentMethod;




  let billingAddress;
  let billingApt;
  let billingCountry;
  let billingZipcode;
  let billingState;
  let billingCity;
  let billingPhone;



  if(billingAddressSameAsShipping){




    billingAddress = requestData.order.address;
    billingApt = requestData.order.apt?requestData.order.apt:null;
    billingCountry = requestData.order.country;
    billingZipcode = requestData.order.zipcode;
    billingState = requestData.order.state;
    billingCity = requestData.order.city;
    billingPhone = requestData.order.phone;
  }

  else{
    billingAddress = document.getElementById("address").value;
    billingApt = document.getElementById("apt")?.value;
    billingCountry = document.getElementById("country").value;
    billingZipcode = document.getElementById("zipcode").value;
    billingState = document.getElementById("state").value;
    billingCity = document.getElementById("city").value;
    billingPhone = document.getElementById("phone").value;

   

  }


  billingApt = billingApt!=""?billingApt:null;
  billingCountry= swapCountryCode(billingCountry);
  billingPhone = billingPhone!=""?billingPhone:null;

    

      const {error, paymentMethod} = await stripe.createPaymentMethod({
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
              country: swapCountryCode(billingCountry)
          },
          phone:  billingPhone
      }
  });




  transactionError= error; 
  transactionPaymentMethod= paymentMethod;
  




       


        if(!transactionError) {
          try {



            




              const {id} = transactionPaymentMethod
             
           
              

  

       
              

              const response = await fetch("/api/make-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...requestData, stripeId:id
                }),
              });
              const data=await response.json();
              console.log('rp',data);
              console.log('ss', data.clientSecret)
              if(data.success) {
               
               
               console.log('pay success');
               
               setGiftDiscount(data.giftDiscount);
               setPaymentProcessed(true);
              //  setPaymentProcessing(false);

              setTimeout(()=>{router.push("/thank-you");},500)
                
                  
                  
                
             
              }
              else{setStripeError({stripeServerError: data.error});setPaymentProcessing(false);
              //Ovde izbaci gresku
              // setStripeError({stripeServerError: 'Error occured. Payment was not processed.'})
              }
  
          } catch (error) {
            console.log('error',error)
            setPaymentProcessing(false);
            setStripeError({stripeServerError: 'Error occured. Payment was not processed.'});
          }
      } else {
        console.log(transactionError)
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
  const errorName = `Enter a valid ${stripeField==='cardNumber'?'card number':(stripeField==='expiryDate'?'expiry date':'security number')}`
  setErrors({...errors, [stripeField]: undefined});
 
  
  errorhelperRef.current[stripeField]=(!event.complete || event.error || event.empty) && errorName;

  setNonEmptyFields({...nonEmptyFields, [stripeField]: !event.empty})

  console.log('changed field', nonEmptyFields)
 
  
};

const handleCCBlur= ()=>{
  
  setErrors(errorhelperRef.current);
  
  setFocusedField();
}
  
    

  return (
    <div className={styles.creditCardForm}>
    
     
    <div className={styles.ccInputRow}>
    <div className={styles.form_group}>
    <div className={styles.inputWrapper}>
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
      <span className={`${styles.label} ${nonEmptyFields.cardNumber && styles.floatingLabel}`}>Card number</span>

</div>
{/* defaultValues */}
{/* https://stripe.com/docs/js/elements_object/create_payment_element#payment_element_create-options */}



      {errors.cardNumber && <p className={styles.stripeError}><ErrorIcon/>{errors.cardNumber}</p>}
        </div>
</div>
      <div className={styles.ccInputRow}>



       <div className={styles.form_group}>

       <div className={styles.inputWrapper}>
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

    
    <span className={`${styles.label} ${nonEmptyFields.expiryDate && styles.floatingLabel}`}>Expiration Date (MM / YY)</span>
   
    </div>


    
    {errors.expiryDate && <p className={styles.stripeError}><ErrorIcon/>{errors.expiryDate}</p>}




    </div>
     <div className={styles.form_group}>

      <div className={styles.inputWrapper}>
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
  <span className={`${styles.label} ${nonEmptyFields.cvv && styles.floatingLabel}`}>Security code</span>
   </div>
 
  {errors.cvv && <p className={styles.stripeError}><ErrorIcon/>{errors.cvv}</p>}


  </div>
      

</div>
       
<div className={`${styles.ccInputRow} ${styles.lastCcInputRow}`}>
<InputField
       id="cardHolderName"
       placeHolder='Name on card'
          type="text"
          name="name"
         value={cardHolderName}
         handleChange={(event)=>{
          
          setErrors({...errors, "cardHolderName": undefined});
          
          setCardHolderName(event.target.value)}

        
        }


         
     
        
         error={errors.cardHolderName}
        />
      </div>
      <div tabIndex={0} className={styles.billingCheckboxDiv} onClick={()=>{setBillingAddressSameAsShipping(!billingAddressSameAsShipping)}}>
      <div id="isShippingBilling" className={`${styles.addressTypeChecker} ${billingAddressSameAsShipping && styles.addressTypeCheckerChecked}`} 
     
      >
        <CorrectIcon styleClassName={styles.addressCheckerImage}/>
        </div>
      <span className={styles.billingCheckboxLabel}>
      Use shipping address as billing address
    </span>
    </div>


  <BillingInfo isOpen={!billingAddressSameAsShipping} errors={billingErrors} setErrors={setBillingErrors}/>










    <button className={`${styles.payNowButton} ${(paymentProcessed || paymentProcessing) && styles.payNowButtonPaying}`} onClick={handleStripePay}>{paymentProcessed?<CorrectIcon styleClassName={styles.correctIcon}/>:
    paymentProcessing?
    <Spinner/>
    :"Pay now"}</button>
    {stripeError?.stripeServerError && <span className={styles.paymentError}><ErrorIcon/>{stripeError.stripeServerError}</span>}
    </div>
  );
};







