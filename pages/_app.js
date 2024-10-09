import  { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";


import "@/styles/globals.css";
import Navbar from "@/components/GeneralComps/Navbar/Navbar.jsx";
import {useGlobalStore} from "@/contexts/AppContext";
import Footer from "@/components/GeneralComps/Footer/Footer";
import SEO from '@/utils/SEO-configs/next-seo.config.js'
import SubscribePopup from "@/components/GeneralComps/SubscribePopup/SubscribePopup";
import { inter, eb_Garamond } from "@/utils/utils-client/fonts";
import { DefaultSeo } from "next-seo";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import CSS for NProgress













export default function App({ Component, pageProps }) {
  

  
  

  const router = useRouter();




  const { emailPopupOn, changeEmailPopupOn,cartProducts, setCartProducts, setCartProductsInitialized} = useGlobalStore((state) => ({
    emailPopupOn: state.emailPopupOn,
    changeEmailPopupOn: state.changeEmailPopupOn,
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    setCartProductsInitialized: state.setCartProductsInitialized
  }));

  //Na ovaj nacin koristim ref da bi imao najnoviju vrednost deepLinka
  const deepLinkLevelRef = useRef(useGlobalStore.getState().deepLinkLevel);

  


  useEffect(() => {
    const globalStoreUnsubscribe = useGlobalStore.subscribe(
      (newState) => {
        
       console.log('deep link level', newState.deepLinkLevel)
        deepLinkLevelRef.current = newState.deepLinkLevel;
      },
      (state) => state.deepLinkLevel // Select the deepLinkLevel from the state
    );

    

    return globalStoreUnsubscribe;
  }, []);

 
  



  useEffect(() => {

    //PAZNJA!!!!!!!!!!!!!! OVA FUNKCIJA SE AKTIVIRA SAMO KAD USER KLIKNE BACK ILI SE AKTIVIRA ROUTER.BACK. NI U JEDNOM DRUGOM SLUCAJU!
    //Ako stavim false kao drugi argument, funkcija nece da ide nazad.
    
    router.beforePopState(state => {state.options.scroll = false; return true;});

    
    document.querySelector("html").className = `${inter.variable} ${eb_Garamond.variable}`;
  
    const storedCartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    setCartProducts(storedCartProducts);
    setCartProductsInitialized(true);
  }, []);
  
 
  

  useEffect(() => {




    let popupTimeout;






    const handleRouteChangeStart = (url) => {

      clearTimeout(popupTimeout); 

   

      const handlePopupTurning = () => {
        
        
      
        const validUrls = ['/', '/our-story', '/faq'];
        if (url !== '/404' && (validUrls.includes(url) || url.includes('/products') || url.includes('/collection'))) {

          //Ako je deepLink 0, tj. ni jedna druga deep-link komponenta nije prisutna(write review, fullscreen zoom), prikazati popup
          //Ako je prisutna, cekati 7 sekundi radi ponovne provere. 
          const showPopup = () => {
            if (deepLinkLevelRef.current === 0 && !global.isRouteProcessing) {
              changeEmailPopupOn();
              localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
              router.events.off('routeChangeStart', handleRouteChangeStart);
            } else {
              
              popupTimeout = setTimeout(showPopup, 7000);
            }
          };
      
          showPopup();
        } 
      };
        //Funkcija se moze aktivirati tek nakon 30 sekunde od ulaska u link.
        popupTimeout = setTimeout(handlePopupTurning, 3000);
      
    
    }



      const daysBetweenEmailPopups = 0;

      const popupShownDate = localStorage.getItem("popupShownDateInDays");
      const emailPopupTimeChecker = popupShownDate ? Math.floor(Date.now() / 86400000) - popupShownDate : null;
      
      if (!popupShownDate || emailPopupTimeChecker >= daysBetweenEmailPopups) {
        handleRouteChangeStart(router.pathname);
        router.events.on('routeChangeStart', handleRouteChangeStart);
      }

  

   

  return () => {
    clearTimeout(popupTimeout); 
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };


  }, []);





  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      if (!deepLinkLevelRef.current) {
          NProgress.start();
      }

      global.isRouteProcessing = true;
  };

  const handleComplete = () => {
      if (!deepLinkLevelRef.current) {
          NProgress.done();
      }

      global.isRouteProcessing=false;

      
  };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);






  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);





 







  return (
    <div id="hronika" className="hronika">
      <DefaultSeo {...SEO} />
      {emailPopupOn && <SubscribePopup />}
      {!router.pathname.includes('admin') && <Navbar />}
      <Component {...pageProps} />
      {!router.pathname.includes('admin') && <Footer />}
    </div>
  );
}
