import { create } from "zustand";

export const useGlobalStore = create((set) => {
  return {
    cartProductsInitialized: false,
    setCartProductsInitialized: () => set({ cartProductsInitialized: true }),
    newProduct:undefined,
    setNewProduct: (newNewProduct) => set({newProduct: newNewProduct}),
    cartProducts: [],
    setCartProducts: (newCartProducts) => set({ cartProducts: newCartProducts }),
    giftDiscount: false,
    setGiftDiscount: (newGiftDiscount) => set({ giftDiscount: newGiftDiscount }),
    deepLinkLevel: 0,
    increaseDeepLinkLevel: () => set((state) => ({ deepLinkLevel: state.deepLinkLevel + 1 })),
    decreaseDeepLinkLevel: () => set((state) => ({ deepLinkLevel: state.deepLinkLevel - 1 })),
    emailPopupOn: false,
    changeEmailPopupOn: () => set((state) => ({ emailPopupOn: !state.emailPopupOn })),
    
  };
});


