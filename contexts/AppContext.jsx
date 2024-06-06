import { create } from "zustand";

export const useGlobalStore = create((set) => {
  return {
    newProduct:undefined,
    setNewProduct: (newNewProduct) => set({newProduct: newNewProduct}),
    cartProducts: [],
    setCartProducts: (newCartProducts) => set({ cartProducts: newCartProducts }),
    giftDiscount: false,
    setGiftDiscount: (newGiftDiscount) => set({ giftDiscount: newGiftDiscount })
  };
});


