import { useRouter } from "next/router";
import CheckoutInfo from "@/components/Checkout/CheckoutInfo";
import OrderDetails, {

} from "@/components/Checkout/OrderDetails";
import  { useState, useEffect } from "react";

import products from "../../../data/products.json";
import Head from "next/head";
import styles from "../checkout.module.css";
import CheckoutLogo from "@/components/Checkout/CheckoutLogo/CheckoutLogo";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import CheckoutProvider from "@/contexts/CheckoutContext";

const BuyNowPage = () => {
  const router = useRouter();

  const { params } = router.query;
  console.log(params);

  const [loaded, setLoaded] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  


  useEffect(() => {
    const queryParameters = window.location.search;
    const urlParams = new URLSearchParams(queryParameters);

    // Get individual query parameters
    const productid = urlParams.get("productid");
    const variant = urlParams.get("variant");
    const quantity = urlParams.get("quantity");

  
    const product = products.find((p) => {
      return p.id == productid && (variant ? p.variants.find((v)=>{return v.name==variant}): true);
    });

    if (product) {
      const newProduct = {
        id: product.id,
        quantity: quantity,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: variant
      };
      setCartProducts([newProduct]);
    } else {
      // setCartProducts([]);
    }
    setLoaded(true);
  }, []);

  const renderFail = () =>{

  
  





 
    return <div className={styles.mainWrapper}>
   

    {loaded && params?<>

    <h1>Product not found.</h1>
    
    
      <span className={styles.emptyCartText}>
   Check url for type errors, or go to product page.
      </span>
      <Link className={styles.shopNowLink} href="/products">
            <button className={styles.shopNow}>Shop Now</button>
          </Link>
   
   
      </>:<h1>Loading checkout...</h1>
      }

   
   
 
    </div>;
  }

  return (
    
    <div className={styles.checkoutMainContainer}>
      <NextSeo {...unimportantPageSeo('/checkout')}/>
    
        {params !== "buynow" || cartProducts.length === 0?renderFail():
       <CheckoutProvider buyNowProduct={cartProducts}>
      <CheckoutLogo/>
      <div className={styles.checkout_container}>
        <OrderDetails products={cartProducts} />

        <CheckoutInfo products={cartProducts} setCartProducts={setCartProducts}/>
       
        </div>
        </CheckoutProvider>
      }
      </div>
   
  );
};

export default BuyNowPage;
