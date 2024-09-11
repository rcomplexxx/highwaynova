



  

import { createContext, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useGlobalStore } from './AppContext';
import checkDiscountSavesMoreThenBundle from '@/utils/compareDiscountAndBundle';
import findBestBundle from '@/utils/findBestBundle'



export const CheckoutContext = createContext({total:0,subTotal:0, coupon:{code: "", discount: 0}, setAndValidateCouponCode:()=>{}, discount:0, tip:0, setTip:()=>{} });



 const CheckoutProvider = ({ children, buyNowProduct }) => {







 
 

    const [subscribe, setSubscribe] = useState(false);
    const [coupon, setCoupon] = useState({code: "", discount: 0});
    const [tip, setTip]= useState(0);
    const [cartProducts, setCartProducts] = useState(buyNowProduct?findBestBundle(buyNowProduct):[...useGlobalStore(state => state.cartProducts)])
  

    




    useLayoutEffect(()=>{

      

      let newCartProducts = findBestBundle(cartProducts);

      if(coupon.code === "BUNDLE")return;
      
     
      
      const alterProduct = newCartProducts.find(cp =>{return cp.priceBeforeBundle!==undefined});
  
      if(coupon.code!==""){


        console.log('checking altered product', alterProduct)
  
        if (alterProduct) {

        
          newCartProducts = newCartProducts.map(cp => {
            if (cp.priceBeforeBundle !== undefined) {
              cp.price = cp.priceBeforeBundle;
              delete cp.priceBeforeBundle;
              delete cp.bundleQuantity;
              delete cp.bundleLabel;
            }
            return cp;
          });

      
        }


      }

      else{

        if (alterProduct) {

          let bundleDiscount = 0;

          newCartProducts.forEach(cp =>{

            if(cp.priceBeforeBundle)bundleDiscount += cp.quantity * (cp.priceBeforeBundle - cp.price);
          });


          setCoupon({code : "BUNDLE", discount: bundleDiscount})

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

            setCoupon({code: newCoupon.code.toUpperCase(), discount: newCoupon.discountPercentage*subTotal/100 })
            }

            else{
              
        return {error: "Coupon code saves less then bundle", couponCode: newCoupon.code};
            }
            
    
          return true;
        } 
        

        return {error: "Incorrect coupon code"};



    },[coupon.code]);





    








    const subTotal = useMemo(() => {
        
        let subTotal = 0;
        cartProducts.forEach((cp, i) => {
            subTotal = subTotal + cp.quantity * (cp.priceBeforeBundle?cp.priceBeforeBundle:cp.price);
        });
        subTotal = subTotal.toFixed(2);
   
        return subTotal
      }, [cartProducts]);

  
  


   








      const total = useMemo(()=>{
        return (subTotal - coupon.discount + parseFloat(tip)).toFixed(2)
     }, [subTotal, coupon.discount, tip]);

  
    return (
      <CheckoutContext.Provider value={{cartProducts, total,subTotal, coupon, setAndValidateCoupon, tip, setTip, subscribe, setSubscribe }}>
        {children}
      </CheckoutContext.Provider>
    );
  };
  
  export default CheckoutProvider;