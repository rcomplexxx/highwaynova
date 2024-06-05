import CheckoutInfo from "@/components/Checkout/CheckoutInfo";
import OrderDetails from "@/components/Checkout/OrderDetails";
import React, {  useEffect, useState, } from "react";
import styles from "./checkout.module.css";
import {useCounterStore} from "@/contexts/AppContext";
import CheckoutLogo from "@/components/Checkout/CheckoutLogo/CheckoutLogo";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import CheckoutProvider from "@/contexts/CheckoutContext";

const CheckoutPage = () => {
  const cartProducts = useCounterStore(state=>state.cartProducts)
  const [loaded, setLoaded] = useState(false);
 

  useEffect(()=>{
    setLoaded(true)
    
  },[])

 
  

   const renderEmptyCartCheckout = ()=> { return <div className={styles.mainWrapper}>
     
    <div className={`${styles.containerStyle} ${styles.emptyCartMainDiv}`}>
    {loaded?<>
    <h1 className={`${styles.title}  ${styles.emptyTitle}`}>Your cart is empty</h1>
    <div className={styles.emptyCartDiv}>
      <p className={styles.emptyCartText}>
      Add your favorite items to your cart.
      </p>
      <Link className={styles.shopNowLink} href="/products">
            <button className={styles.shopNow}>Shop Now</button>
          </Link>
      </div>
      </>:<h1 className={`${styles.title} ${styles.emptyTitle}`}>Loading checkout...</h1>
    
      }
    </div>
   
    
   
    </div>;
 }
 
  

  return (
    <CheckoutProvider>
      <div className={styles.checkoutMainContainer}>
        <NextSeo {...unimportantPageSeo('/checkout')}/>
      {cartProducts.length===0 ?renderEmptyCartCheckout():
      <>
      <CheckoutLogo/>
      <div className={`${styles.checkout_container} ${styles.checkoutAbsolute}`}>
        <OrderDetails  products={cartProducts} />

        <CheckoutInfo  products={cartProducts} />
          
       
      </div>
      </>
} 

</div>
</CheckoutProvider>
  );
};

export default CheckoutPage;
