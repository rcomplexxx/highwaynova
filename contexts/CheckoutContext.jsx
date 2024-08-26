



  

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useGlobalStore } from './AppContext';
import checkDiscountSavesMoreThenBundle from '@/utils/compareDiscountAndBundle';
import findBestBundle from '@/utils/findBestBundle'



export const CheckoutContext = createContext({total:0,subTotal:0, couponCode:"", setAndValidateCouponCode:()=>{}, discount:0, tip:0, setTip:()=>{} });



 const CheckoutProvider = ({ children, buyNowProduct }) => {







 
 

    const [subscribe, setSubscribe] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [tip, setTip]= useState(0);
    const [cartProducts, setCartProducts] = useState(findBestBundle(buyNowProduct?buyNowProduct:[...useGlobalStore(state => state.cartProducts)]))
  

    




    useEffect(()=>{

      let newCartProducts = findBestBundle(cartProducts)
  
      if(couponCode!==""){
        const alterProduct = newCartProducts.find(cp =>{return cp.priceBeforeBundle!==undefined});

        console.log('checking altered product', alterProduct)
  
        if (alterProduct) {
          newCartProducts = newCartProducts.map(cp => {
            if (cp.priceBeforeBundle !== undefined) {
              cp.price = cp.priceBeforeBundle;
              delete cp.priceBeforeBundle;
            }
            return cp;
          });
        }


      }

      console.log('new cart products are', newCartProducts)

      setCartProducts(newCartProducts);
  
    },[couponCode])


    const setAndValidateCouponCode = useCallback((newCouponCode)=>{

        if(newCouponCode==="" && couponCode!==""){setCouponCode(""); return true;}

        const newCoupon = coupons.find((c) => {
            return c.code.toUpperCase() === newCouponCode.toUpperCase();
          });

          if (newCoupon) {


            if(checkDiscountSavesMoreThenBundle(cartProducts, newCoupon.discountPercentage)){

            setCouponCode(newCoupon.code.toUpperCase())
            }
    
          return true;
        } else if(!couponCode) return false;

        return false;



    },[couponCode]);





    const discount = useMemo(() => {
      if (couponCode === "") {return 0;}
      
      const newCoupon = coupons.find((c) => {
        return c.code.toUpperCase() === couponCode.toUpperCase();
      });
      if (newCoupon) {
         
       return newCoupon.discountPercentage;
       
      } else {setCouponCode("");return 0;}
    },[couponCode])








    const subTotal = useMemo(() => {
        
        let subTotal = 0;
        cartProducts.forEach((cp, i) => {
            subTotal = subTotal + cp.quantity * cp.price;
        });
        subTotal = subTotal.toFixed(2);
   
        return subTotal
      }, [cartProducts]);

  
  


   








      const total = useMemo(()=>{
        return (subTotal - discount*subTotal/100 + parseFloat(tip)).toFixed(2)
     }, [subTotal, discount, tip]);

  
    return (
      <CheckoutContext.Provider value={{cartProducts, total,subTotal, couponCode, setAndValidateCouponCode, discount, tip, setTip, subscribe, setSubscribe }}>
        {children}
      </CheckoutContext.Provider>
    );
  };
  
  export default CheckoutProvider;