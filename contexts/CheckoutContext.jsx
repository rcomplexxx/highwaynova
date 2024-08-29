



  

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useGlobalStore } from './AppContext';
import checkDiscountSavesMoreThenBundle from '@/utils/compareDiscountAndBundle';
import findBestBundle from '@/utils/findBestBundle'



export const CheckoutContext = createContext({total:0,subTotal:0, coupon:{code: "", discount: 0}, setAndValidateCouponCode:()=>{}, discount:0, tip:0, setTip:()=>{} });



 const CheckoutProvider = ({ children, buyNowProduct }) => {







 
 

    const [subscribe, setSubscribe] = useState(false);
    const [coupon, setCoupon] = useState({code: "", discount: 0});
    const [tip, setTip]= useState(0);
    const [cartProducts, setCartProducts] = useState(findBestBundle(buyNowProduct?buyNowProduct:[...useGlobalStore(state => state.cartProducts)]))
  

    




    useEffect(()=>{

      let newCartProducts = findBestBundle(cartProducts);
      
     
  
      if(coupon.code!==""){

        const alterProduct = newCartProducts.find(cp =>{return cp.priceBeforeBundle!==undefined});

        console.log('checking altered product', alterProduct)
  
        if (alterProduct) {

        
          newCartProducts = newCartProducts.map(cp => {
            if (cp.priceBeforeBundle !== undefined) {
              cp.price = cp.priceBeforeBundle;
              delete cp.priceBeforeBundle;
              delete cp.bundleQuantity;
            }
            return cp;
          });

      
        }


      }

 
      

      console.log('new cart products are', newCartProducts)

      setCartProducts(newCartProducts);
  
    },[coupon.code])





    const setAndValidateCoupon = useCallback((newCouponCode)=>{

        if(newCouponCode==="" && coupon.code!==""){setCoupon({code: "", discount: 0}); return true;}

        const newCoupon = coupons.find((c) => {
            return c.code.toUpperCase() === newCouponCode.toUpperCase();
          });

          if (newCoupon) {


            if(checkDiscountSavesMoreThenBundle(cartProducts, newCoupon.discountPercentage)){

            setCoupon({code: newCoupon.code.toUpperCase(), discount: newCoupon.discountPercentage})
            }
    
          return true;
        } 
        

        return false;



    },[coupon.code]);





    








    const subTotal = useMemo(() => {
        
        let subTotal = 0;
        cartProducts.forEach((cp, i) => {
            subTotal = subTotal + cp.quantity * cp.price;
        });
        subTotal = subTotal.toFixed(2);
   
        return subTotal
      }, [cartProducts]);

  
  


   








      const total = useMemo(()=>{
        return (subTotal - coupon.discount*subTotal/100 + parseFloat(tip)).toFixed(2)
     }, [subTotal, coupon.discount, tip]);

  
    return (
      <CheckoutContext.Provider value={{cartProducts, total,subTotal, coupon, setAndValidateCoupon, tip, setTip, subscribe, setSubscribe }}>
        {children}
      </CheckoutContext.Provider>
    );
  };
  
  export default CheckoutProvider;