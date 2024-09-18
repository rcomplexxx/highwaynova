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
  

  
  const [emailPopup, setEmailPopup] = useState(false);

  const router = useRouter();




  const { cartProducts, setCartProducts, setCartProductsInitialized} = useGlobalStore((state) => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    setCartProductsInitialized: state.setCartProductsInitialized
  }));


  const deepLinkLevelRef = useRef(useGlobalStore.getState().deepLinkLevel);


  useEffect(() => {
    const unsubscribe = useGlobalStore.subscribe(
      (newState) => {
        deepLinkLevelRef.current = newState.deepLinkLevel;
      },
      (state) => state.deepLinkLevel // Select the deepLinkLevel from the state
    );

    return unsubscribe;
  }, []);



  useEffect(()=>{
    
    router.beforePopState((state) => {
      
      state.options.scroll = false;
        
      return true;
   
    });

    

    document.querySelector("html").className=`${inter.variable} ${eb_Garamond.variable}`;

    const storedCartProducts = JSON.parse(localStorage.getItem("cartProducts"));
    setCartProducts(storedCartProducts || []);
    setCartProductsInitialized(true);



  },[])
 
  

  useEffect(() => {



    



    let popupTimeout;











    const handleRouteChangeStart = (url) => {

      clearTimeout(popupTimeout); 

   

      







      const handlePopupTurning = ()=>{


   
        console.log('my deep link level is', deepLinkLevelRef.current,"trying to turn on email popup")
    
 
       if(  url!=='/404' && (url==='/' || url.includes('/products') || url.includes('/collection') || url==='/our-story' || url==='/faq')){
 
         if(deepLinkLevelRef.current===0){
        
         setEmailPopup(true); 
         localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
         router.events.off('routeChangeStart', handleRouteChangeStart);
         }
 
         else{

          const handlePopupTurningAfterDeepLink = ()=>{

        
                if(deepLinkLevelRef.current===0){

                  setEmailPopup(true); 
                  localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
                  router.events.off('routeChangeStart', handleRouteChangeStart);
                  
                }
                else{
                  popupTimeout = setTimeout( handlePopupTurningAfterDeepLink, 7000)
                }

              

          }
          
          popupTimeout = setTimeout( handlePopupTurningAfterDeepLink, 5000)
         
         }
       
    
       
       }

       else{

        setEmailPopup(false);
        
       }
       
      
       }

      
      popupTimeout= setTimeout( handlePopupTurning, 30000);
      
    };
    




  
    if(localStorage.getItem("popupShownDateInDays")){
      
      const emailPopupTimeChecker = Math.floor(Date.now() / 86400000)-localStorage.getItem("popupShownDateInDays");

      const daysBetweenEmailPopups = 14;

     

      if(emailPopupTimeChecker>=daysBetweenEmailPopups){
      
      handleRouteChangeStart(router.pathname);
      router.events.on('routeChangeStart', handleRouteChangeStart);
      }

      
    }
    else{
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
      if (deepLinkLevelRef.current === 0) {
          NProgress.start();
      }
  };

  const handleComplete = () => {
      if (deepLinkLevelRef.current === 0) {
          NProgress.done();
      }
  };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);






  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);





 







  return (
 
     
    
    <div
      id="hronika"
      className={`hronika`}>
    
   
   
        <DefaultSeo {...SEO}/>
       
      
      {emailPopup && <SubscribePopup setEmailPopup={setEmailPopup}/>}
    {!router.pathname.includes('admin') && <Navbar/>}

      
      
        <Component {...pageProps} />
   
   
      
      {!router.pathname.includes('admin') &&  <Footer />}
       </div>
   
     
  
  );
}
