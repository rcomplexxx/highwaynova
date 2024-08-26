import CheckoutInfo from "@/components/Checkout/CheckoutInfo";
import OrderDetails from "@/components/Checkout/OrderDetails";
import {  useEffect, useState, } from "react";
import styles from "./checkout.module.css";
import {useGlobalStore} from "@/contexts/AppContext";
import CheckoutLogo from "@/components/Checkout/CheckoutLogo/CheckoutLogo";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import CheckoutProvider from "@/contexts/CheckoutContext";
import { Spinner2 } from "@/public/images/svgs/svgImages";

const CheckoutPage = () => {
  const cartProducts = useGlobalStore(state=>state.cartProducts)
  const [loaded, setLoaded] = useState(false);
 

  useEffect(()=>{
    setLoaded(true)
    
  },[])

 
  

   const renderEmptyCartCheckout = ()=> { return <div className={styles.mainWrapper}>
     


    {loaded?<>
    <h1>Your cart is empty</h1>
  
  
      <span className={styles.emptyCartText}>
      Add your favorite items to your cart.
      </span>
      <Link className={`${styles.shopNow} mainButton`} href="/products">Shop Now</Link>
     
     
      </>:<Spinner2/>
    
      }
 
 
   
    
   
    </div>;
 }
 
  

  return (
   

      <div className={styles.checkoutMainContainer}>
        <NextSeo {...unimportantPageSeo('/checkout')}/>
      {cartProducts.length===0 ?renderEmptyCartCheckout():
       <CheckoutProvider>
      <CheckoutLogo/>
      <div className={styles.checkout_container}>
        <OrderDetails/>

        <CheckoutInfo/>
          
       
      </div>
      </CheckoutProvider>
} 

</div>


  );
};

export default CheckoutPage;
