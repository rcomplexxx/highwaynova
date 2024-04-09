import React, { useState, useEffect,  useMemo } from "react";
import { useRouter } from "next/router";


import "../styles/globals.css";
import Navbar from "../components/Navbar/Navbar.jsx";
import AppContext from "@/contexts/AppContext";
import Footer from "@/components/Footer/Footer";
import SEO from '@/utils/SEO-configs/next-seo.config.js'
import Head from "next/head";
import EmailFlowPopup from "@/components/EmailFlowPopup/EmailFlowPopup";
import { inter, eb_Garamond } from "@/utils/fonts";
import { DefaultSeo } from "next-seo";





export default function App({ Component, pageProps }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [newProduct, setNewProduct]=useState();
  const [emailPopup, setEmailPopup] = useState(false);

  const router = useRouter();



  

 
  

  useEffect(() => {


    router.beforePopState((state) => {
      
      state.options.scroll = false;
        
      return true;
   
    });

    

    document.querySelector("html").className=`${inter.variable} ${eb_Garamond.variable}`;

    const storedCartProducts = JSON.parse(localStorage.getItem("cartProducts"));
    setCartProducts(storedCartProducts || []);







    let popupTimeout;


    const handleRouteChangeStart = (url) => {

      clearTimeout(popupTimeout); 



      
      popupTimeout= setTimeout(()=>{

     
       
         
      if(  url!=='/404' && (url==='/' || (url.includes('/products') && !url.includes('#zoom')
      && !url.includes('#write-review')) ||url.includes('/collection') || url==='/our-story' || url==='/faq')){
        setEmailPopup(true); 
        localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
        router.events.off('routeChangeStart', handleRouteChangeStart);
      }
     
      }, 30000);
      
    };

  
    if(localStorage.getItem("popupShownDateInDays")){
      if((Math.floor(Date.now() / 86400000))-localStorage.getItem("popupShownDateInDays")>15)
      router.events.on('routeChangeStart', handleRouteChangeStart);
    }
    else{
      localStorage.setItem("popupShownDateInDays", Math.floor(Date.now() / 86400000));
    }
    

  

  
   
 
 
 
  



   
   

   

  return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };


  


  }, []);

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);







const totalItems= useMemo(()=>{
  let s=0;
  cartProducts.forEach(cp=>{
    s=s+cp.quantity;
  })
  return s
},[cartProducts])




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
    {!router.pathname.includes('admin') && <Navbar totalItems={totalItems}  newProduct={newProduct} setNewProduct={setNewProduct}/>}

      
      <AppContext.Provider value={{ cartProducts, setCartProducts, setNewProduct }}>
        <Component {...pageProps} />
      </AppContext.Provider>
      
      {!router.pathname.includes('admin') &&  <Footer />}
       </div>
   
     
  
  );
}
