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
import { Spinner2 } from "@/public/images/svgs/svgImages";
import findBestBundle from '@/utils/findBestBundle'

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
    const variant = urlParams.get("variant")?.split(',');
    const quantity = urlParams.get("quantity")?.split(',');



    let quantitiesAreNumbers = true;
    quantity.forEach((q)=>{

      
  
      
      if(isNaN(Number(q))){

        quantitiesAreNumbers=false;

      }


    })


      if(!quantitiesAreNumbers || variant.length!==quantity.length) {
        
    setLoaded(true);
        return;

      }

  
    const product = products.find((p) => {
      if(p.id == productid){

       
          if(!variant) return true;
          
        else {
          let variantsExist = true;

          variant.forEach(v=>{
            
            if(!p.variants.find((pv)=>{return pv.name===v}))variantsExist=false;
            
            })

            return variantsExist;
        }

          

      }
    });
    


    

    if (product) {


      if(variant.length>1){

     

        
        let newProducts = [];

      for(let i=0; i < variant.length; i++){

        console.log('new var pr', product.id)

        newProducts.push({
          id: product.id,
          quantity: Number(quantity[i]),
          name: product.name,
          image: product.images[0],
          price: product.price,
          variant: variant[i]
        })
      }

      
      setCartProducts(findBestBundle(newProducts));

      }


      else{
      const newProduct = {
        id: product.id,
        quantity: Number(quantity[0]),
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: variant?variant[0]:undefined
      };

      setCartProducts(findBestBundle([newProduct]));
    }
     
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
        <OrderDetails products={cartProducts} />

        <CheckoutInfo products={cartProducts} setCartProducts={setCartProducts}/>
       
        </div>
        </CheckoutProvider>
      }
      </div>
   
  );
};

export default BuyNowPage;
