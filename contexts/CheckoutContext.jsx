



  

import { createContext, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import coupons from '@/data/coupons.json'
import { useGlobalStore } from './AppContext';
import checkDiscountSavesMoreThenBundle from '@/utils/utils-client/compareDiscountAndBundle';
import findBestBundle from '@/utils/utils-client/findBestBundle'



export const CheckoutContext = createContext({cartProducts: [], total:'0.00',subTotal:'0.00', coupon:{code: "", discount: '0.00'}, setAndValidateCouponCode:()=>{}, tip:'0.00', setTip:()=>{}, subscribe: false, setSubscribe:()=>{} });



 const CheckoutProvider = ({ children, buyNowProduct }) => {







 
 

    const [subscribe, setSubscribe] = useState(false);
    const [coupon, setCoupon] = useState({code: "", discount: 0});
    const [tip, setTip]= useState('0.00');
    const [cartProducts, setCartProducts] = useState(buyNowProduct?findBestBundle(buyNowProduct):[...useGlobalStore(state => state.cartProducts)])
  

    




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
    if (!checkDiscountSavesMoreThenBundle(cartProducts, newCoupon.discountPercentage))   return {error: "Coupon code saves less then bundle", couponCode: newCoupon.code};

    
      const newCartProducts = cartProducts.map(cp =>
        cp.priceBeforeBundle
          ? { ...cp, price: cp.priceBeforeBundle, priceBeforeBundle: undefined, bundleQuantity: undefined, bundleLabel: undefined }
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
  .reduce((total, cp) => total + cp.quantity * (cp.priceBeforeBundle || cp.price), 0)
  .toFixed(2);
   
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