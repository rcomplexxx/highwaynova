import { useRouter } from "next/router";
import CheckoutInfo from "@/components/Checkout/CheckoutInfo";
import OrderDetails, {

} from "@/components/Checkout/OrderDetails";
import  { useState, useEffect } from "react";

import products from "@/data/products.json";

import styles from "../checkout.module.css";
import CheckoutLogo from "@/components/Checkout/CheckoutLogo/CheckoutLogo";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import CheckoutProvider from "@/contexts/CheckoutContext";
import { Spinner2 } from "@/public/images/svgs/svgImages";


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
    const variants = urlParams.get("variant")?.split(',');
    const quantities = urlParams.get("quantity")?.split(',');



    console.log('hello!', variants, quantities)

    
    if (!quantities || (variants && quantities.length!==variants.length) || quantities.some(q => isNaN(q))) {
      setLoaded(true);
      return;
    }

    
    

  
      const product = products.find(p => 
        p.id == productid && (
          !variants || variants.every(v => 
            p.variants.some(pv => pv.name.toLowerCase().replace(/\s+/g, "-") === v.toLowerCase().replace(/\s+/g, "-"))
          )
        )
      );
    


    

    if (product) {


   
      
      let newProducts = [];

      


 
      
 
        if(variants){

      variants.forEach((variant, i) => {

       
        const variantObj = product.variants.find(pv=>{return pv.name.toLowerCase().replace(/\s+/g, "-") === variant.toLowerCase().replace(/\s+/g, "-")});
        


        

        newProducts.push({
          id: product.id,
          quantity: Number(quantities[i]),
          name: product.name,
          image: product.images[variantObj.variantProductImageIndex],
          price: product.price,
          variant: variantObj.name
        })
      })

    }

      else{
        
        newProducts.push({
        id: product.id,
        quantity: Number(quantities[0]),
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: variants?variants[0]:undefined
      });


      }

      






   


    setCartProducts(newProducts);
     
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
      <Link className={`${styles.shopNow} mainButton`} href="/products">Shop Now </Link>
   
   
      </>:<Spinner2/>
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
        <OrderDetails />

        <CheckoutInfo/>
       
        </div>
        </CheckoutProvider>
      }
      </div>
   
  );
};

export default BuyNowPage;
