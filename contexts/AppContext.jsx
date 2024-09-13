import { create } from "zustand";
import findBestBundle from '@/utils/findBestBundle.js'
import currency from "currency.js";

export const useGlobalStore = create((set) => {
  return {

    newProducts:[],
    setNewProducts: (newNewProducts) => {
      
      set({newProducts: newNewProducts})
      
    },
    cartProducts: [],
    setCartProducts: (newCartProducts) => {


      
      
      set({ cartProducts: findBestBundle(newCartProducts) });


      const total = currency(0, {precision: 2});
     
      newCartProducts.forEach((cp) => total.add(currency(cp.price).multiply(cp.quantity)));

      set({ subTotal: total.value });
      
    },
    subTotal: 0,
    cartProductsInitialized: false,
    setCartProductsInitialized: (areInitialized)=> set({cartProductsInitialized: areInitialized}),

    giftDiscount: false,
    
    setGiftDiscount: (newGiftDiscount) => set({ giftDiscount: newGiftDiscount }),
    deepLinkLevel: 0,
    increaseDeepLinkLevel: () => set((state) => ({ deepLinkLevel: state.deepLinkLevel + 1 })),
    decreaseDeepLinkLevel: () => set((state) => ({ deepLinkLevel: state.deepLinkLevel - 1 })),

    emailPopupOn: false,
    changeEmailPopupOn: () => set((state) => ({ emailPopupOn: !state.emailPopupOn })),
    
  };
});


