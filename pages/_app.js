import  { useState, useEffect } from "react";
import { useRouter } from "next/router";


import "../styles/globals.css";
import Navbar from "../components/Navbar/Navbar.jsx";
import {useCounterStore} from "@/contexts/AppContext";
import Footer from "@/components/Footer/Footer";
import SEO from '@/utils/SEO-configs/next-seo.config.js'
import Head from "next/head";
import EmailFlowPopup from "@/components/EmailFlowPopup/EmailFlowPopup";
import { inter, eb_Garamond } from "@/utils/fonts";
import { DefaultSeo } from "next-seo";














export default function App({ Component, pageProps }) {
  

  
  const [emailPopup, setEmailPopup] = useState(false);

  const router = useRouter();




  const { cartProducts, setCartProducts } = useCounterStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));

 
  

  useEffect(() => {


    router.beforePopState((state) => {
      
      state.options.scroll = false;
        
      return true;
   
    });

    

    document.querySelector("html").className=`${inter.variable} ${eb_Garamond.variable}`;

    const storedCartProducts = JSON.parse(localStorage.getItem("cartProducts"));
    setCartProducts(storedCartProducts || []);





    console.log('1111111112222222', Date.now())



    let popupTimeout;


    const handleRouteChangeStart = (url) => {

      clearTimeout(popupTimeout); 

      console.log('1111111112222222', url)
    
      
      popupTimeout= setTimeout(()=>{

   
       
   

      if(  url!=='/404' && (url==='/' || (url.includes('/products') && !url.includes('#zoom')
      && !url.includes('#write-review')) || url.includes('/collection') || url==='/our-story' || url==='/faq')){
       
     
        setEmailPopup(true); 
        localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
      
   
      
      }
     
      }, 10000);
      
    };


  
    if(localStorage.getItem("popupShownDateInDays")){
      
      const emailPopupTimeChecker = Math.floor(Date.now() / 86400000)-localStorage.getItem("popupShownDateInDays");

      const daysBetweenEmailPopups = 2;

     

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
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };


  




  }, []);









  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);





 







  return (
 
     
    
    <div
      id="hronika"
      className={`hronika`}>
    
    
       {/* <Head>
      <title>Gamebuff</title>
        <link rel="icon" href="/images/favicon.ico" />
     
        </Head> */}
        <DefaultSeo {...SEO}/>
       
      
      {emailPopup && <EmailFlowPopup setEmailPopup={setEmailPopup}/>}
    {!router.pathname.includes('admin') && <Navbar/>}

      
      
        <Component {...pageProps} />
   
   
      
      {!router.pathname.includes('admin') &&  <Footer />}
       </div>
   
     
  
  );
}
