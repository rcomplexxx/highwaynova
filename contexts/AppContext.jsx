import { create } from "zustand";
import findBestBundle from '@/utils/utils-client/findBestBundle.js'
import currency from "currency.js";

export const useGlobalStore = create((set, get) => {

  global.deepLinkLevel = 0;

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
    deepLink: [],
    increaseDeepLink: (source) => {

      global.deepLinkLastSource = source;

      global.deepLinkLevel= global.deepLinkLevel + 1;

      set((state) => ({ deepLink: [...state.deepLink, source]}))
    
    },

    decreaseDeepLink: (executeNextLink) => {

      const executeLink = () => {

        if(global.deepLinkLevel===0){
         
          if(global.executeNextLink !== get().router.asPath)get().router.push(global.executeNextLink);

          global.executeNextLink=false;
          return true;
       
        }
        return false;

      }

      if(global.executeNextLink){
        global.deepLinkLevel =  global.deepLinkLevel - 1;
        executeLink();
        set((state)=> ({deepLink: []}))
        global.deepLinkLastSource=undefined;
      }

      else if(executeNextLink){
        global.executeNextLink = executeNextLink;

        
        
        global.deepLinkLevel =  global.deepLinkLevel - 1;
        if(!executeLink())
        window.history.go(-global.deepLinkLevel)

       else{
        set((state)=> ({deepLink: []}))
        global.deepLinkLastSource=undefined;
       }
        
        
        
      }

      else{

      global.deepLinkLevel= global.deepLinkLevel - 1;
      
      set((state) => { const newDeepLink = state.deepLink.slice(0, -1); global.deepLinkLastSource = newDeepLink?.[newDeepLink.length - 1]; return { deepLink: newDeepLink }})

      }
      
    },
    emailPopupOn: false,
    changeEmailPopupOn: () => set((state) => { return { emailPopupOn: !state.emailPopupOn }}),
    router: null, // initially null
    setRouter: (router) => set({ router }),
  };
});


