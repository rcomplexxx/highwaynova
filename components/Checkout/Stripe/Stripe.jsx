import React, { useCallback, useContext, useRef, useState } from 'react';

import styles from './stripe.module.css'
import { useStripe,  CardNumberElement, CardCvcElement, CardExpiryElement} from "@stripe/react-stripe-js"

import FloatingBadge from '../FloatingBadge/FloatingBadge';
import { Elements, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from "next/router";
import Image from 'next/image';
import BillingInfo from './BillingInfo/BillingInfo';
import swapCountryCode from '@/utils/countryList';
import { CheckoutContext } from '@/contexts/CheckoutContext';
import InputField from '../Input/InputField';
               

const Stripe = ({organizeUserData, checkFields}) => {
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
    const [billingErrors, setBillingErrors]= useState({});
    const [floatingLabels, setFloatingLabels]= useState({});
    const [focusedField, setFocusedField]= useState();
    const [paymentProcessing, setPaymentProcessing]= useState(false);
    const [cardHolderName, setCardHolderName]= useState('');
    const [cardStatesEntered, setCardStatesEntered]= useState({
      cardNumber:false, expiryDate:false, cvv:false, cardHolderName:false
    });
    const [stripeError, setStripeError]= useState();
    const [errors, setErrors] = useState({});
    const errorhelperRef=useRef({});
    const floatingLabelsHelper=useRef({cardNumber:false, expiryDate:false, cvv:false});
    const stripe = useStripe();
    const elements= useElements();

    const router = useRouter();

    const {total} = useContext(CheckoutContext);


    const deleteError = (field) => {
      if (errors.hasOwnProperty(field)) {
        const newErrors = { ...errors };
      
        delete newErrors[field];
        setErrors(newErrors);
      }
    };

    const getInputColor =  useCallback(()=>{
      return '#0A0B09';
    },[])


    const getInputBgColor = useCallback(()=>{
      return 'transparent';
    },[])
 
  
   
   
    const checkBillingFields=()=>{


      if(billingAddressSameAsShipping)return true;

      let newErrors = {};
      // if(document.getElementById('email').value==='') return actions.reject();
      const testId = (id) => {
        if (document.getElementById(id).value === "") {
          newErrors = { ...newErrors, [id]: `${id} is a required field.` };
        }
      };
  
      if (document.getElementById("billingEmail").value === "") {
        newErrors = { ...newErrors, billingEmail: "Email is a required field." };
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
      if (phone.length < 5)
        newErrors = { ...newErrors, phone: "Invalid phone" };
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
          }
        }
      }
  
      setBillingErrors(newErrors);
  
  
      const errorsExist=Object.keys(newErrors).length !== 0;
      console.log('errorsExist?', errorsExist)
      if (errorsExist) {
        window.scrollTo({
          top:
            document
              .getElementById(Object.keys(newErrors)[0])
              .getBoundingClientRect().top +
            window.scrollY -
            12,
          behavior: "smooth",
        });
  
     
    }
  
    return !errorsExist;
  }

 


const handleStripePay= async(event)=>{
  console.log('billErr', billingErrors);
  event.preventDefault();
  setPaymentProcessing(true);
  setStripeError();
  errorhelperRef.current={...errors};
  if (!errors.hasOwnProperty('cardNumber')){errorhelperRef.current={...errorhelperRef.current, cardNumber:'Enter a valid card number'}}
  if (!errors.hasOwnProperty('expiryDate')){errorhelperRef.current={...errorhelperRef.current, expiryDate:'Enter a valid card number'}}
  if (!errors.hasOwnProperty('cvv')){errorhelperRef.current={...errorhelperRef.current, cvv:'Enter a valid card number'}}
  if(cardHolderName==='') {errorhelperRef.current={...errorhelperRef.current, cardHolderName:'Enter your name exactly as it\'s written on the card'}}
  setErrors(errorhelperRef.current);
 
  const clickPass= checkFields()   && !errors.cardNumber && !errors.expiryDate && !errors.cvv && !errors.cardHolderName;
  if(!clickPass) {checkBillingFields(); setPaymentProcessing(false);return;}
  if(!checkBillingFields()){setPaymentProcessing(false);return;}

  const cardElement = elements.getElement(CardNumberElement);

  const requestData = organizeUserData('STRIPE');
  console.log('THE BILLING FUCKING DATA!',requestData);

  let transactionError, transactionPaymentMethod;

  if(billingAddressSameAsShipping){
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
          name: cardHolderName,
          email: requestData.order.email,
          address: {
              line1: requestData.order.address,
              line2: requestData.order.apt?requestData.order.apt:null,
              city: requestData.order.city,
              state: requestData.order.state,
              postal_code: requestData.order.zipcode,
              country: swapCountryCode(requestData.order.country)
          },
          phone:requestData.order.phone
      }
  });

  transactionError= error; transactionPaymentMethod= paymentMethod;
    
  }
  else{
   
    const billingAddress = document.getElementById("address").value;
    const billingApt = document.getElementById("apt")?.value;
    const billingCountry = document.getElementById("country").value;
    const billingZipcode = document.getElementById("zipcode").value;
    const billingState = document.getElementById("state").value;
    const billingCity = document.getElementById("city").value;
    const billingPhone = document.getElementById("phone").value;

      const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
          name: cardHolderName,
          email: requestData.order.email,
          address: {
            line1: billingAddress,
            line2: billingApt!=""?billingApt:null,
              city: billingCity,
              state: billingState,
              postal_code: billingZipcode,
              country: swapCountryCode(billingCountry)
          },
          phone:  billingPhone!=""?billingPhone:null
      }
  });

  transactionError= error; transactionPaymentMethod= paymentMethod;
  }

       


        if(!transactionError) {
          try {



            




              const {id} = transactionPaymentMethod
             
           
             

  

              const requestDataFinal=  {...requestData, stripeId:id, amount: total};
              console.log('reqdata BITNO ~!!!~', requestDataFinal)

              const response = await fetch("/api/make-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...requestDataFinal, items: JSON.stringify(requestDataFinal.items)
                }),
              });
              const data=await response.json();
              console.log('rp',data);
              console.log('ss', data.clientSecret)
              if(data.success) {
               
               
               
                router.push("/thank-you");
                  
                  
                
             
              }
              else{setPaymentProcessing(false);
              //Ovde izbaci gresku
              setStripeError('Error occured. Payment was not processed.')
              }
  
          } catch (error) {
            console.log(error)
            setPaymentProcessing(false);
            setStripeError('Error occured. Payment was not processed.')
          }
      } else {
        console.log(transactionError)
        if(transactionError.code==='incomplete_number' || transactionError.code==='invalid_number')setErrors({...errors,cardNumber:'Enter a valid card number'})
        else if( transactionError.code === 'incomplete_expiry') setErrors({...errors,expiryDate:'Enter a valid exipry date'})
        else if( transactionError.code === 'incomplete_cvc') setErrors({...errors,cvv:'Enter a valid security code'})
        else if( transactionError.code === 'incorrect_address' || transactionError.code === "account_number_invalid") stripeError('Billing address invalid. Please check provided information.')
        else setErrors({...errors,payment:'Error occured. Payment was not processed.'})
        setPaymentProcessing(false);
        // Enter your name exactly as it’s written on your card
      }


}

const handleCCChange=   (event) => {
  // Access the value from the CardElement when it changes
  //elementType - cardExpiry - cardCvc
  //  cardNumber expiryDate cvv
  const errorField= event.elementType==='cardNumber'?'cardNumber':(event.elementType==='cardExpiry'?'expiryDate':'cvv')
  const errorName = `Enter a valid ${event.elementType==='cardNumber'?'card number':(event.elementType==='expiry date'?'expiryDate':'security number')}`
  setErrors({...errors, [errorField]: undefined});
  const cardValue = event;
  errorhelperRef.current[errorField]=(!cardValue.complete || cardValue.error)?errorName:undefined;
  floatingLabelsHelper.current[errorField]=!cardValue.empty;
};

const handleCCBlur= ()=>{
  console.log('b',floatingLabelsHelper.current);
  setErrors(errorhelperRef.current);
  setFloatingLabels({...floatingLabelsHelper.current});
  setFocusedField(undefined);
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
      setFloatingLabels({...floatingLabelsHelper.current, cardNumber:true});
    
      }}
    options={{placeholder:'',  style: {
      base: {
        color: getInputColor(),
        backgroundColor:getInputBgColor(),
        lineHeight:"52px",
      },
    
     
      invalid: {
        color: getInputColor()
      }
    }}}
        className={`${styles.input_field} ${errors.cardNumber && styles.input_error} ${focusedField==='cardNumber' && styles.stripeFieldFocused}`}
      /> 
      <FloatingBadge imageName='lock11.png'/>
      <span className={`${styles.label} ${floatingLabels.cardNumber && styles.labelFloating}`}>Card number</span>

</div>
{/* defaultValues */}
{/* https://stripe.com/docs/js/elements_object/create_payment_element#payment_element_create-options */}



      {errors.cardNumber && <p className={styles.stripeError}>{errors.cardNumber}</p>}
        </div>
</div>
      <div className={styles.ccInputRow}>
       <div className={styles.form_group}>
      <CardExpiryElement id="expiryDate"
 onBlur={handleCCBlur}
 onFocus={()=>{
  setFocusedField('expiryDate');
  setFloatingLabels({...floatingLabelsHelper.current, expiryDate:true});
  }}
 onChange={handleCCChange}
      options={{placeholder:'',  style: {
        base: {
          color: getInputColor(),
          backgroundColor:getInputBgColor(),
          lineHeight:"52px",
        },
        invalid: {
          color: getInputColor()
        }
      }}}
      className={`${styles.input_field} ${errors.expiryDate && styles.input_error} ${focusedField==='expiryDate' && styles.stripeFieldFocused}`}
    />
    <span className={`${styles.label} ${floatingLabels.expiryDate && styles.labelFloating}`}>Expiration Date (MM / YY)</span>
    {errors.expiryDate && <p className={styles.stripeError}>{errors.expiryDate}</p>}
    </div>
     <div className={styles.form_group}>

      <div className={styles.inputWrapper}>
  <CardCvcElement  id="cvv" 
   onBlur={handleCCBlur}
   onChange={handleCCChange}
  onFocus={()=>{
    setFocusedField('cvv');
  setFloatingLabels({...floatingLabelsHelper.current, cvv:true});
  }}
   options={{placeholder:'',  style: {
    base: {
      color: getInputColor(),
      backgroundColor: getInputBgColor(),
      lineHeight:"52px",
    },
    invalid: {
      color: getInputColor()
    }
  }}}
  className={`${styles.input_field} ${errors.cvv && styles.input_error} ${focusedField==='cvv' && styles.stripeFieldFocused}`}/>
  <FloatingBadge message={'3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front.'}/>
  <span className={`${styles.label} ${floatingLabels.cvv && styles.labelFloating}`}>Security code</span>
   </div>
 
  {errors.cvv && <p className={styles.stripeError}>{errors.cvv}</p>}
  </div>
      

</div>
       
<div className={`${styles.ccInputRow} ${styles.lastCcInputRow}`}>
<InputField
       id="cardHolderName"
       placeHolder='Name on card'
          type="text"
          name="name"
         value={cardHolderName}
         handleChange={(event)=>{deleteError(event.target.id);setCardStatesEntered({...cardStatesEntered,cardHolderName:true});setCardHolderName(event.target.value)}}
         
        //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
   
        //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
         error={errors.cardHolderName}
        />
      </div>
      <div className={styles.billingCheckboxDiv}  onClick={()=>{setBillingAddressSameAsShipping(!billingAddressSameAsShipping)}}>
      <div id="isShippingBilling" className={styles.addressTypeChecker} 
     
      >
          {billingAddressSameAsShipping && <Image src='/images/correctDark.svg' height={10} width={10}/>}
        </div>
      <span className={styles.billingCheckboxLabel}>
      Use shipping address as billing address
    </span>
    </div>


  <BillingInfo isOpen={!billingAddressSameAsShipping} errors={billingErrors} setErrors={setBillingErrors}/>










    <button className={styles.payNowButton} onClick={handleStripePay}>{paymentProcessing?
    <Image src='/images/spinner.png' height={0} width={0} className={styles.spinner}/>
    :'Pay now'}</button>
    </div>
  );
};




export default function StripeWrapper({organizeUserData,  products, setCartProducts, checkFields}){
const stripePromise = loadStripe('pk_test_51OR1EhAom3KfH7oBf5QRKboVHPrFIrZ3nwmtwS30uSDtrHbpgwsFzf19Np73RjxFiAqUy0tjPi5BIYdDmSPDExya00m4ZFZoI1');

return (
  <Elements stripe={stripePromise}>
  <Stripe organizeUserData={organizeUserData}  products={ products} setCartProducts={setCartProducts } checkFields={checkFields}/>
  </Elements>
);
}



// {/* <Cards
// number={cardNumber}
// name={name}
// expiry={expiry}
// cvc={cvc}
// focused={focus}
// /> */}