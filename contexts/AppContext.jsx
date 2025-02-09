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
    increaseDeepLink: (source, sourceTag) => {

      console.log('curr user path', get().pathname)

       history.pushState(null, null, `${get().pathname}${sourceTag?`#${sourceTag}`:''}`);

      global.deepLinkLastSource = source;

      global.deepLinkLevel= global.deepLinkLevel + 1;

      

   

      set((state) => ({ deepLink: [...state.deepLink, source]}))
    
    },

    decreaseDeepLink: (executeNextLink) => {

      const executeLink = (isFirstCall) => {


        if(global.deepLinkLevel===0){
         
          if(global.executeNextLink !== get().pathname)get().router.push(global.executeNextLink);


          set((state)=> ({deepLink: []}))
          global.deepLinkLastSource=undefined;
          global.executeNextLink=undefined;
          return;
       
        }

        if(isFirstCall)window.history.go(-global.deepLinkLevel);

        global.deepLinkLevel =  0;

      }

    
      


      


      if(global.executeNextLink) return executeLink();


      
      global.deepLinkLevel =  global.deepLinkLevel - 1;

     
      if(executeNextLink){
        global.executeNextLink = executeNextLink;
        executeLink(true);
       
      }

      else{
      
      set((state) => { const newDeepLink = state.deepLink.slice(0, -1); 
        global.deepLinkLastSource = newDeepLink?.at(-1);
        return { deepLink: newDeepLink }})
      }


      
    },
    emailPopupOn: false,
    changeEmailPopupOn: () => set((state) => { return { emailPopupOn: !state.emailPopupOn }}),
    router: null, // initially null
    setRouter: (router) => set({ router }),
    pathname: '/',
    setPathname: (pathname)=> set({pathname})
  };
});


