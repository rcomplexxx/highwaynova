

import { create } from "zustand";
import coupons from '@/data/coupons.json'
import { useGlobalStore } from "./AppContext";




//https://www.reddit.com/r/reactjs/comments/oho7nw/zustand_store_not_updating_in_real_time_from/
//https://stackoverflow.com/questions/76729269/can-we-trigger-events-in-other-zustand-stores-react





  export const checkoutStore = create((set,get) => {
  return {

    total,
    subTotal,
   
    subscribe: false,
   
    couponCode:"",
    discount: 0,
    tip: 0,

   
    setCouponCode: (newCouponCode)=>set({couponCode: newCouponCode}),
    setAndValidateCouponCode: (tempCouponCode) => {


      if(tempCouponCode==="" && couponCode!==""){
        get().setCouponCode(""); 
        
        return true;
      
      }

        const newCoupon = coupons.find((c) => {
            return c.code.toUpperCase() === tempCouponCode.toUpperCase();
          });

          if (newCoupon) {
            get().setCouponCode(newCoupon.code.toUpperCase())
            get().setDiscount(newCoupon.discountPercentage)
          return true;
        } else if(!couponCode) {  get().setCouponCode(""); get().setDiscount(0); return false};

        return true;



        
    
    
    },

    updateSubTotal: () => {
      let subTotal = 0;
      const counterState = useGlobalStore.getState(); // Assuming useGlobalStore is accessible here
      counterState.cartProducts.forEach((cp) => {
        subTotal += cp.quantity * cp.price;
      });
      set({ subTotal: subTotal.toFixed(2) });
    },



    setSubscribe: ((newSubscribe) => set({subscribe: newSubscribe})),
   
    setDiscount: (newDiscount)=> set({ discount: newDiscount}),
    
    setTip: (newTip)=> set({ tip: newTip})
  };
});


useGlobalStore.subscribe(
  (cartProducts) => checkoutStore.getState().updateSubTotal()
);





checkoutStore.subscribe(
  (cartProducts) => checkoutStore.setState({ subTotal: subTotal(cartProducts) })
);

export const total = createSelector(
  [subTotal, checkoutStore.getState()],
  (subTotalValue, checkoutState) => {
    // Calculate total based on subTotal, discount, tip, and any other values from checkoutState
    const total = (
      subTotalValue -
      (checkoutState.discount * subTotalValue) / 100 +
      parseFloat(checkoutState.tip)
    ).toFixed(2);
    return total;
  }
);
