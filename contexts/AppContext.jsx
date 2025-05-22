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

      if(global.deepLinkLevel===0 && source!=='productZoom')document.documentElement.classList.add("hideScroll");

       history.pushState(null, null, `${get().pathname}${sourceTag?`#${sourceTag}`:''}`);

      global.deepLinkLastSource = source;

      global.deepLinkLevel= global.deepLinkLevel + 1;

      

   

      set((state) => ({ deepLink: [...state.deepLink, source]}))
    
    },

    decreaseDeepLink: (executeNextLink) => {


      //gygyb
      const executeLink = () => {


        if(global.deepLinkLevel !== 0) {
          window.history.go(-global.deepLinkLevel);
          return global.deepLinkLevel =  0;
       }


          if(global.executeNextLink !== get().pathname)get().router.push(global.executeNextLink);


          set((state)=> ({deepLink: []}))
          global.deepLinkLastSource=undefined;
          global.executeNextLink=undefined;
          document.documentElement.classList.remove("hideScroll");
       
      
          

       

      }

    
      


      if(!global.executeNextLink)global.deepLinkLevel--;


      if(executeNextLink || global.executeNextLink) {
        if(executeNextLink)global.executeNextLink = executeNextLink;
        return executeLink();
      }

        
      
      
      set((state) => { 
        

        const previousDeepLinkLastSource = global.deepLinkLastSource;

        const newDeepLink = state.deepLink.slice(0, -1); 
        global.deepLinkLastSource = newDeepLink?.at(-1);

         if(global.deepLinkLevel===0 && previousDeepLinkLastSource!=='productZoom')document.documentElement.classList.remove("hideScroll");

        return { deepLink: newDeepLink }})
      




      
    },
    emailPopupOn: false,
    setEmailPopupOn: (enabled) => set((state) => { return { emailPopupOn: enabled }}),
    shouldDeepLinkSurvivePopState: (deepLinkReference)=>{
  if(!global.executeNextLink && global.deepLinkLastSource !== deepLinkReference) return true;
  return false;

    
    },
    router: null, // initially null
    setRouter: (router) => set({ router }),
    pathname: '/',
    setPathname: (pathname)=> set({pathname})
  };
});


