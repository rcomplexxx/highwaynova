import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useCounterStore } from './AppContext';




export const CheckoutContext = createContext({total:0,subTotal:0, couponCode:"", setAndValidateCouponCode:()=>{}, discount:0, tip:0, setTip:()=>{} });



 const CheckoutProvider = ({ children, buyNowProduct }) => {


 let  cartProducts;

    if(buyNowProduct){
      cartProducts= buyNowProduct;
    }
    else{
      cartProducts = useCounterStore(state => state.cartProducts);
    }
   

    const [subscribe, setSubscribe] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [tip, setTip]= useState(0);



    const setAndValidateCouponCode = useCallback((tempCouponCode)=>{

        if(tempCouponCode==="" && couponCode!==""){setCouponCode(""); return true;}

        const newCoupon = coupons.find((c) => {
            return c.code.toUpperCase() === tempCouponCode.toUpperCase();
          });

          if (newCoupon) {
            setCouponCode(newCoupon.code.toUpperCase())
    
          return true;
        } else if(!couponCode) return false;

        return true;



    },[couponCode])








    const subTotal = useMemo(() => {
        
        let subTotal = 0;
        cartProducts.forEach((cp, i) => {
            subTotal = subTotal + cp.quantity * cp.price;
        });
        subTotal = subTotal.toFixed(2);
   
        return subTotal
      }, [cartProducts]);

  
  


    const discount = useMemo(() => {
        if (couponCode === "") {return 0;}
        
        const newCoupon = coupons.find((c) => {
          return c.code.toUpperCase() === couponCode.toUpperCase();
        });
        if (newCoupon) {
           
         return newCoupon.discountPercentage;
         
        } else {setCouponCode("");return 0;}
      },[couponCode])








      const total = useMemo(()=>{
        return (subTotal - discount*subTotal/100 + parseFloat(tip)).toFixed(2)
     }, [subTotal, discount, tip]);

  
    return (
      <CheckoutContext.Provider value={{ total,subTotal, couponCode, setAndValidateCouponCode, discount, tip, setTip, subscribe, setSubscribe }}>
        {children}
      </CheckoutContext.Provider>
    );
  };
  
  export default CheckoutProvider;