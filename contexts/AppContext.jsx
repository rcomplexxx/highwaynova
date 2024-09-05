import { create } from "zustand";
import findBestBundle from '@/utils/findBestBundle.js'

export const useGlobalStore = create((set) => {
  return {

    newProducts:[],
    setNewProducts: (newNewProducts) => set({newProducts: newNewProducts}),
    cartProducts: [],
    setCartProducts: (newCartProducts) => set({ cartProducts: findBestBundle(newCartProducts) }),
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


