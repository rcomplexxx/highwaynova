import { create } from "zustand";

export const useGlobalStore = create((set) => {
  return {

    newProduct:undefined,
    setNewProduct: (newNewProduct) => set({newProduct: newNewProduct}),
    cartProducts: [],
    setCartProducts: (newCartProducts) => set({ cartProducts: newCartProducts }),
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


