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
import { usePathname } from "next/navigation";













export default function App({ Component, pageProps }) {
  

  
  

  const router = useRouter();

  const pathname = usePathname();




  const {  emailPopupOn, setEmailPopupOn,cartProducts, setCartProducts, setCartProductsInitialized, setRouter, setPathname} = useGlobalStore((state) => ({
    
    emailPopupOn: state.emailPopupOn,
    setEmailPopupOn: state.setEmailPopupOn,
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    setCartProductsInitialized: state.setCartProductsInitialized,
    setRouter: state.setRouter,
    setPathname: state.setPathname
  }));



  



 
  



  useEffect(() => {

    //PAZNJA!!!!!!!!!!!!!! OVA FUNKCIJA SE AKTIVIRA SAMO KAD USER KLIKNE BACK ILI SE AKTIVIRA ROUTER.BACK. NI U JEDNOM DRUGOM SLUCAJU!
    //Ako stavim false kao drugi argument, funkcija nece da ide nazad.
    
    router.beforePopState(state => {state.options.scroll = false; return true;});

    // history.scrollRestoration = 'manual';
    document.querySelector("html").className = `${inter.variable} ${eb_Garamond.variable}`;
  
    const storedCartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    setCartProducts(storedCartProducts);
    setCartProductsInitialized(true);

    setRouter(router);

  }, []);

  useEffect(()=>{
    setPathname(pathname)
  },[pathname])
  
 
  

  useEffect(() => {




    let popupTimeout;






    const handleRouteChangeStart = (url) => {



      clearTimeout(popupTimeout); 

       const validUrls = ['/', '/our-story', '/faq'], validUrlPrefix = ['/products', '/collection'];
        if (!(validUrls.includes(url) || validUrlPrefix.some((prefix) => url.startsWith(prefix)))) return;
        


    
        
       

        
         //Ako je deepLink 0 i ne procesuira se ni jedna ruta,  prikazati popup. U suprotnom, cekati 7 sekundi radi ponovne provere. 
          const showPopup = () => {

              
             const isSubscribePopupAllowed = (!global.deepLinkLastSource) && !global.isRouteProcessing

            if (isSubscribePopupAllowed) {
              setEmailPopupOn(true); 
              localStorage.setItem("lastPopupTriggerDateInDays", Math.floor(Date.now() / 86400000));
              router.events.off('routeChangeStart', handleRouteChangeStart);
            } 
            else popupTimeout = setTimeout(showPopup, 7000);
            
          };
      
    
          
        //Funkcija se moze aktivirati tek nakon 30 sekunde od ulaska u link.
        popupTimeout = setTimeout(showPopup, 30000);
      
    
    }



      const lastPopupTriggerDateInDays = localStorage.getItem("lastPopupTriggerDateInDays"), daysBetweenEmailPopups = 14;
    

      if (lastPopupTriggerDateInDays && Math.floor(Date.now() / 86400000) - lastPopupTriggerDateInDays < daysBetweenEmailPopups) return;



        handleRouteChangeStart(router.pathname);
        router.events.on('routeChangeStart', handleRouteChangeStart);
      

  

   

  return () => {
    clearTimeout(popupTimeout); 
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };


  }, []);





  useEffect(() => {

    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      if (!global.deepLinkLastSource)  NProgress.start();
      global.isRouteProcessing = true;
  };

  const handleComplete = () => {
      if (!global.deepLinkLastSource)  NProgress.done();
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





 



  const shouldShowLayout = !['/admin', '/checkout', '/thank-you'].some((path) => router.pathname.startsWith(path));




  return (
    <>
    
      <DefaultSeo {...SEO} />
      {emailPopupOn && <SubscribePopup />}
      
            {shouldShowLayout && <Navbar />}
          <div id="hronika" className="hronika">
            <Component {...pageProps} />
          </div>
          {shouldShowLayout && <Footer/>}
    </>
  );
}
