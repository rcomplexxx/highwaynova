



  

import { createContext, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useGlobalStore } from './AppContext';
import checkDiscountSavesMoreThenBundle from '@/utils/utils-client/compareDiscountAndBundle';
import findBestBundle from '@/utils/utils-client/findBestBundle'
import swapCountryCode from '@/utils/utils-client/countryList';



export const CheckoutContext = createContext({cartProducts: [], total:'0.00',subTotal:'0.00', coupon:{code: "", discount: '0.00'}, setAndValidateCouponCode:undefined, tip:'0.00',
 setTip:undefined, customerSubscribed: false, setCustomerSubscribed:undefined, organizeUserData: undefined });



 const CheckoutProvider = ({ children, buyNowProduct }) => {







 
 

    const [customerSubscribed, setCustomerSubscribed] = useState(false);
    const [coupon, setCoupon] = useState({code: "", discount: 0});
    const [tip, setTip]= useState('0.00');
    const [cartProducts, setCartProducts] = useState(buyNowProduct?findBestBundle(buyNowProduct):[...useGlobalStore(state => state.cartProducts)])
    const [errors, setErrors] = useState({});


    



    const checkFields=useCallback((specificPaymentData)=>{


      const findError = () => {
        const testId = (id) => {

         
          const inputEl = document.getElementById(id);

          console.log('test', id, inputEl.value)
          if (!inputEl.value) {
            return setErrors({ [id]: `${inputEl.labels[0]?.textContent.trim()} is a required field.` }) || id;
          
          }
        };
      
        const emailTest = (id) => {
          const value = document.getElementById(id).value;
          if (testId(id)) return id;
          if (!/^\S{3,}@\S{3,}\.\S{2,}$/.test(value)) {
            setErrors({ email: "Please enter a valid email address." });
            return id;
          }
        };
      
        const phoneTest = (id) => {
          const value = document.getElementById(id).value;
          if (id === "billingPhone") return false;
          if (testId(id)) return id;
          if (value.length < 5 || [...value].some(char => !/[0-9+\-(). /]/.test(char))) {
            setErrors({ phone: "Invalid phone" });
            return id;
          }
        };
      
        const validateFields = (fields) => {
    
          return Object.values(fields).find((field) => testId(field))

            
        }


      
        if (emailTest("email")) return "email";
        const fieldsValidation = validateFields(["country", "firstName", "lastName", "address", "city", "state", "zipcode"]);
        if (fieldsValidation) return fieldsValidation;
      
        if (phoneTest("phone")) return "phone";









      

        if(specificPaymentData?.method ==="stripe"){

          if (Object.values(specificPaymentData.cardErrors).some(Boolean)) {
           return specificPaymentData.setCardErrors(specificPaymentData.cardErrors) || "iregularField";
          }

          const cardHolderNameInput = document.getElementById('cardHolderName');
          if (!cardHolderNameInput.value) {
            setErrors({ ["cardHolderName"]: `Please enter a valid card name.` });
            return "cardHolderName";
          }

          

        if (specificPaymentData.billingRequired) {
         
         
        


          if (emailTest("billingEmail")) return "billingEmail";


          const fieldsValidation = validateFields(["billingCountry", "billingAddress", "billingCity", "billingState", "billingZipcode"]);
          if (fieldsValidation) return fieldsValidation;


          if (phoneTest("billingPhone")) return "billingPhone";
        }
      }


      
        return false;
      };
      
   
  
  
      const errorFieldId = findError();
      if (errorFieldId && errorFieldId!=="iregularField") window.scrollTo({ top: document.getElementById(errorFieldId).getBoundingClientRect().top + window.scrollY - 12, behavior: "smooth" });
  
    return !(errorFieldId  && errorFieldId!=="iregularField");
  },[])
  
  
  

    




    useLayoutEffect(() => {
      if (coupon.code) return;
    
      const newCartProducts = findBestBundle(cartProducts);
    
      if (!newCartProducts.some(cp => cp.priceBeforeBundle)) return;
    
      const bundleDiscount = newCartProducts.reduce(
        (total, cp) => total + (cp.priceBeforeBundle ? cp.quantity * (cp.priceBeforeBundle - cp.price) : 0), 
        0
      );
    
      setCoupon({ code: "BUNDLE", discount: bundleDiscount.toFixed(2) });
      setCartProducts(newCartProducts);
    }, [coupon.code]);












 const setAndValidateCoupon = useCallback((newCouponCode) => {
  if (!newCouponCode && coupon.code) {
    setCoupon({ code: "", discount: 0 });
    return true;
  }

  const newCoupon = coupons.find(c => c.code.toUpperCase() === newCouponCode.toUpperCase());
  if (!newCoupon) return { error: "Incorrect coupon code" };

  if (coupon.code === "BUNDLE") {
    
    if (!checkDiscountSavesMoreThenBundle(cartProducts, newCoupon.discountPercentage))   
      return {error: "Coupon code saves less then bundle", couponCode: newCoupon.code};

    
      const newCartProducts = cartProducts.map(cp =>
        cp.priceBeforeBundle
          ? { ...cp, price: cp.priceBeforeBundle, stickerPrice: cp.stickerPriceBeforeBundle, priceBeforeBundle: undefined, bundleQuantity: undefined, bundleLabel: undefined }
          : cp
      );

      const newSubTotal = newCartProducts.reduce((total, cp) => total + cp.price * cp.quantity, 0).toFixed(2);

      setCartProducts(newCartProducts);
      setCoupon({ code: newCoupon.code.toUpperCase(), discount: ((newCoupon.discountPercentage * newSubTotal) / 100).toFixed(2) });
      return true;
    
    
  }

  setCoupon({ code: newCoupon.code.toUpperCase(), discount: ((newCoupon.discountPercentage * subTotal) / 100).toFixed(2) });
  return true;
}, [coupon.code]);





    








    const subTotal = useMemo(() => {
        
      return cartProducts
  .reduce((total, cp) => total + cp.quantity * cp.price, 0)
  .toFixed(2);
   
      }, [cartProducts]);

  
      // (cp.priceBeforeBundle || 


   








      const total = useMemo(()=>{
        return (subTotal - (coupon.code!=="BUNDLE"?coupon.discount:0) + parseFloat(tip)).toFixed(2)
     }, [subTotal, coupon.discount, tip]);



     
const organizeUserData = useCallback((paymentMethod, paymentToken) => {
  
  // Collect user input values
  const fields = ["email", "firstName", "lastName", "address", "apt", "country", "zipcode", "state", "city", "phone"];
  const userData = fields.reduce((acc, field) => {
    acc[field] = document.getElementById(field)?.value || "";
    return acc;
  }, {});


  
  const items = cartProducts.map(({ id, quantity, variant }) => ({ id, quantity, variant, ordered: false }));

  
  const requestData = {
    order: {
      ...userData,
      country: swapCountryCode(userData.country),
      items,
      customerSubscribed,
      couponCode: coupon.code === "BUNDLE" ? "" : coupon.code,
      tip,
      clientTotal: total
    },
    paymentMethod,
    paymentToken
  };

  return requestData;
}, [cartProducts, customerSubscribed, coupon.code, tip, total]);




     

  
    return (
      <CheckoutContext.Provider value={{cartProducts, total,subTotal, coupon, setAndValidateCoupon, tip, setTip, customerSubscribed, setCustomerSubscribed, organizeUserData, errors, setErrors, checkFields }}>
        {children}
      </CheckoutContext.Provider>
    );
  };
  
  export default CheckoutProvider;