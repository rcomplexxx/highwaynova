import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import styles from "./checkoutinfo.module.css";
import InputField from "./Input/InputField";
import CountryInput from "./Input/CountryInput/CountryInput";


import FloatingBadge from "./FloatingBadge/FloatingBadge";
import ExpressCheckout from "./ExpressCheckout/ExpressCheckout";
import Link from "next/link";
import PaymentSection from "./PaymentSection/PaymentSection";
import Tip from "./Tip/Tip";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import { CorrectIcon, ErrorIcon, correctIcon } from "@/public/images/svgs/svgImages";
import Image from "next/image";


export default function CheckoutInfo({ products,  setCartProducts }) {
  const [showApt, setShowApt] = useState(false);
  const [errors, setErrors] = useState({});
  // const [shippingType, setShippingType] = useState("free");

  const {couponCode, tip, subscribe, setSubscribe} = useContext(CheckoutContext);

  useEffect(()=>{
   showApt && document.getElementById("apt").focus();
   }, [showApt]);

   useEffect(()=>{
   const emailInput = document.getElementById("email");
    emailInput.readOnly = true;
    emailInput.focus();
    emailInput.readOnly = false;
   },[])

  const handleChange = (event) => {
    if (errors.hasOwnProperty(event.target.id)) {
      const newErrors = { ...errors };
      const field = event.target.id;
      delete newErrors[field];
      setErrors(newErrors);
    }
  };



  const checkFields=useCallback(()=>{


    const findError = ()=>{

    



    // let newErrors = {};
    // if(document.getElementById('email').value==='') return actions.reject();
    const testId = (id) => {
      if (document.getElementById(id).value === "") {
        // newErrors = { ...newErrors, [id]: `${id} is a required field.` };
        setErrors({[id]: `${id} is a required field.`});
        return {[id]: `${id} is a required field.`};
      }
    };

    if (document.getElementById("email").value === "") {
      setErrors({email: "Email is a required field."});
      return {email: "Email is a required field."};
      // newErrors = { ...newErrors, email: "Email is a required field." };
    }
    if (
      !/^\S{3,}@\S{3,}\.\S{2,}$/.test(document.getElementById("email").value)
    ) {
      // newErrors = {
      //   ...newErrors,
      //   email: "Please enter a valid email address.",
      // };

      setErrors({email: "Please enter a valid email address."});
      return {email: "Please enter a valid email address."};
      
    }
    if(testId("country"))return testId("country");
    if(testId("firstName"))return testId("firstName");
    if(testId("lastName")) return testId("lastName");
    if(testId("address"))return testId("address");
    
   
    if(testId("city"))return testId("city");
    if(testId("state"))return testId("state");
    if(testId("zipcode"))return testId("zipcode");

    const phone = document.getElementById("phone").value; //
    if (phone.length < 5)
      // newErrors = { ...newErrors, phone: "Invalid phone" };
      {setErrors({phone: "Invalid phone" });
      return {phone: "Invalid phone" };}
    else {
      for (let i = 0; i < phone.length; i++) {
        const char = phone[i];
        if (
          !(
            (char >= "0" && char <= "9") ||
            ["+", "-", "(", ")", " ", ".", "/"].includes(char)
          )
        ) {
          // newErrors = { ...newErrors, phone: "Invalid phone" };
          setErrors({phone: "Invalid phone" });
          return {phone: "Invalid phone" };
        }
      }
    }
return false;
  }



 


  const error = findError();
  if (error) {
    window.scrollTo({
      top:
        document
          .getElementById(Object.keys(error)[0])
          .getBoundingClientRect().top +
        window.scrollY -
        12,
      behavior: "smooth",
    });




   
  }

  return !error;
},[])



 

 

  const organizeUserData= useCallback((paymentMethod, paymentToken)=>{
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const apt = document.getElementById("apt")?.value;
    const country = document.getElementById("country").value;
    const zipcode = document.getElementById("zipcode").value;
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;
    const phone = document.getElementById("phone").value;
   
    const items=[];
    products.map((product) => {
      items.push({
      id: product.id,
      quantity: product.quantity,
      variant: product.variant
      })
    });
   
    const requestData = {
      order: {
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
        items:items ,
        subscribe,
        couponCode: couponCode,
        tip: tip.toFixed(2)
      },
      paymentMethod: paymentMethod,
      paymentToken: paymentToken

      // Include other payment-related data if required
    };
    return requestData
  }, [subscribe, couponCode, tip]);

 

  return (
      <div className={styles.leftWrapper}>
        <div className={styles.checkout_left}>
          <ExpressCheckout products={products} checkFields={checkFields} organizeUserData={organizeUserData} setCartProducts={setCartProducts } setErrors={setErrors}/>
          <div className={styles.checkout_section}>
            <h2 className={styles.contactTitle}>Contact</h2>
          
              <div className={styles.emailField}>
                <InputField
                  id="email"
                  placeHolder="Email"
                  type="email"
                  handleChange={handleChange}
                  error={errors.email}
                >
                  {errors.email && (
                    <p className={styles.error}><ErrorIcon/>{errors.email}</p>
                  )}
                </InputField>




                <div tabIndex={0} className={styles.emailSubscribeDiv} onClick={()=>{ setSubscribe(!subscribe);}}>
      <div  className={`${styles.emailSubscribeChecker} ${subscribe && styles.emailSubscribeCheckerChecked}`}>
        <CorrectIcon styleClassName={styles.checkImage}/>
      </div>
     
  
      <span className={styles.subscribeText}>
     Email me with news and offers
    </span>

    </div>

{/* .tipShowCheckboxDiv{
 
  display: flex;
  align-items: flex-start;
  width: 100%;

  box-sizing: border-box;
  padding: var(--size-6) var(--size-5) ;
  font-size: var(--font-size-3);
  cursor: pointer;
  user-select: none;
}


.tipShowCheckboxDiv *{
  cursor: pointer;
}

.tipShowChecker{
  
  height:  var(--size-5);
  width:  var(--size-5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid var(--border-color-strong);
  flex-shrink: 0;
}

 */}


   



   



              </div>

              <h2
                className={styles.deliveryTitle}
              >
                Delivery
              </h2>
           

<div className={styles.input_row}>
<CountryInput
                  id="country"
                  setErrors={setErrors}
                  error={errors.country}
                  inputNumber={9}
                />
   </div>
              <div className={styles.input_row}>
                <InputField
                  id="firstName"
                  placeHolder="First name"
                  type="text"
                  handleChange={handleChange}
                  error={errors.firstName}
                />
                <InputField
                  id="lastName"
                  placeHolder="Last name"
                  type="text"
                  handleChange={handleChange}
                  error={errors.lastName}
                />
              </div>
              <div className={styles.input_row}>
                <InputField
                  id="address"
                  placeHolder="Address"
                  type="text"
                  handleChange={handleChange}
                  error={errors.address}
                />
                 </div>
  <div className={styles.input_row}>
    { 
    showApt ? <InputField
                  id="apt"
                  placeHolder="Apartment, suite, etc. (Optional)"
                  type="text"
                />:<p onClick={()=>{setShowApt(true);}}
                
                className={styles.aptAdder}>+ Add apartment, suite etc.</p>
                }
              </div>
              <div className={styles.input_row}>
              <InputField
                  id="city"
                  placeHolder="City"
                  type="text"
                  handleChange={handleChange}
                  error={errors.city}
                />
              
                <InputField
                  id="state"
                  placeHolder="State"
                  type="text"
                  handleChange={handleChange}
                  error={errors.state}
                />
                  <InputField
                  id="zipcode"
                  placeHolder="ZIP code"
                  type="text"
                  handleChange={handleChange}
                  error={errors.zipcode}
                />
              </div>
              <div className={styles.input_row}>
              
                <InputField
                  id="phone"
                  placeHolder="Phone"
                  type="tel"
                  handleChange={handleChange}
                  error={errors.phone}
                  children={<FloatingBadge message={'In case we need to contact you about your order'}/>}
                />
              </div>
            
          </div>

          {/* <div className={styles.checkout_section}>
            <h2>Shipping Method</h2>
            <label className={styles.shipping_method}>
              <input
                type="radio"
                id="freeShipping"
                name="shippingMethod"
                checked={shippingType === "free"}
                className={styles.radioButton}
                onChange={() => {
                  setShippingType("free");
                }}
              />
              <span
                className={`${styles.checkmark} ${
                  shippingType !== "free" && styles.unselectedCheckmark
                }`}
              ></span>
              <span
                className={
                  shippingType === "free"
                    ? styles.checkMarkText
                    : styles.unselectedCheckmarkText
                }
              >
                {" "}
                FREE Shipping (Tracked & Insured){" "}
                <span className={styles.shipping_method_sp}>Free</span>
              </span>
            </label>
            <label className={styles.shipping_method}>
              <input
                type="radio"
                id="expressShipping"
                name="shippingMethod"
                checked={shippingType === "express"}
                className={styles.radioButton}
                onChange={() => {
                  setShippingType("express");
                }}
              />
              <span
                className={`${styles.checkmark}  ${
                  shippingType === "free" && styles.unselectedCheckmark
                }`}
              ></span>
              <span
                className={
                  shippingType !== "free"
                    ? styles.checkMarkText
                    : styles.unselectedCheckmarkText
                }
              >
                Express Shipping (2-3 days){" "}
                <span className={styles.shipping_method_sp}>$9.99</span>
              </span>
            </label>
          </div> */}
         
         <PaymentSection  checkFields={checkFields} organizeUserData={organizeUserData} products={products} setCartProducts={setCartProducts } setErrors={setErrors} />
                
                <Tip products={products} />
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

