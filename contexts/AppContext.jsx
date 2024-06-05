import { create } from "zustand";

export const useCounterStore = create((set) => {
  return {
    newProduct:undefined,
    setNewProduct: (newNewProduct) => set({newProduct: newNewProduct}),
    cartProducts: [],
    setCartProducts: (newCartProducts) => set({ cartProducts: newCartProducts }),
  };
});


