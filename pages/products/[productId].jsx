import  { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import products from "../../data/products.json";
import Image from "next/image";
import {useGlobalStore} from "@/contexts/AppContext";
import CustomerReviews from "@/components/ProductPage/CustomerReviews/CustomerReviews.jsx";





import { useState} from "react";



import QuantityButton from "@/components/ProductPage/QuantityButton/QuantityButton";
import FrequentlyBoughtTogether from "@/components/ProductPage/FrequentlyBoughtTogether/FrequentlyBoughtTogether";

import ProductPageCards from "@/components/ProductPage/ProductPageCards/ProductPageCards";

import ProductPics from "@/components/ProductPage/ProductPics/ProductPics";

import { getStartReviews } from "@/utils/getStartReviews";
import getRatingData from "@/utils/getRatingData";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { productPageSeo } from "@/utils/SEO-configs/next-seo.config";

import { Stars } from "@/public/images/svgs/svgImages";
import { Amex,Discover, Jcb, MasterCard, Visa } from "@/public/images/svgs/svgImages";
import Link from "next/link";

import styles from "../../styles/productpage.module.css";
import BundleOffer from "@/components/ProductPage/BundleOffer/BundleOffer";

const PayPalButton = dynamic(() => import("@/components/Checkout/ExpressCheckout/PayPal/PayPal"));


export default function ProductPage({ product, description, images, startReviews, ratingData }) {


  


  
  if (!product) return   <div className={styles.notFoundDiv}>
    
  
  <h1 className={styles.title404}>We don't sell that product anymore</h1>
  <span className={styles.notification404}>But we have many cool things we'd love you to see.</span>
  
  <Link href='/collections' className={`${styles.shopNow} mainButton`}>Check some cool stuff</Link>
  
  </div>



  

 

  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant]=useState(product.variants && product.variants[0]);
  const [bundleVariants, setBundleVariants] = useState([]);

  const variantIndexToZeroRef = useRef(false);
  




  const { setNewProducts,cartProducts, setCartProducts } = useGlobalStore(state => ({
    setNewProducts: state.setNewProducts,
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));
  

  console.log('currentVariant', variant)


  useLayoutEffect(()=>{

    console.log('this effect reactivated')

    if(!product.variants)return;
    
   
    const queryParameters = window.location.search;
    const urlParams = new URLSearchParams(queryParameters);
    
    const variantByQuery = urlParams.get("variant");

    if(variantByQuery){


      variantIndexToZeroRef.current = true;

      const currentVariant = product.variants?.find(v =>{return v.name === variantByQuery});


        setVariant(currentVariant?currentVariant:product.variants[0]);


    }
    else{

      variantIndexToZeroRef.current = false;
      setVariant(product.variants[0]);
     
    }

     
      setQuantity(1);

      
      

  },[product.id])





  const onAddToCart = useCallback(( quantity = 1,addedProduct=product, addedVariant=variant) => {

    let updatedCartProducts = [...cartProducts];

    
    const newProducts = [];





    const addNewProduct = (newProductObj, newProductVariant, newProductQuantity)=>{

      console.log('info', newProductObj, newProductVariant)


    const productIndex = updatedCartProducts.findIndex((cp) => cp.id === newProductObj.id && cp.variant===newProductVariant);

    if (productIndex !== -1) {
     
      
      updatedCartProducts[productIndex].quantity += newProductQuantity;

      newProducts.push(updatedCartProducts[productIndex])

      
    
  
    } else {


      const variantObj= product.variants.find(pv=>{return pv.name === newProductVariant})


      const newProduct = {
        id: newProductObj.id,
        quantity: newProductQuantity,
        name: newProductObj.name,
        image: variantObj?.variantProductImageIndex>0?newProductObj.images[variantObj?.variantProductImageIndex]:newProductObj.images[0],
        price: newProductObj.price,
        stickerPrice: newProductObj.stickerPrice,
        variant: newProductVariant
      };
      updatedCartProducts.push(newProduct);

      
      newProducts.push(newProduct)

    }


  }

  if(bundleVariants.length!==0){



   for(const variant of bundleVariants){
    
  

    addNewProduct(addedProduct, variant.name, variant.quantity)
   }


 
  }
  else addNewProduct(addedProduct, addedVariant.name, quantity);




  
      setCartProducts( updatedCartProducts);



      const newProductsShrinked = newProducts.reduce((finalNewProducts, newProduct) => {



        const existing = finalNewProducts.find(item => item.id === newProduct.id && item.variant === newProduct.variant);
        if (existing) {
          existing.quantity += 1;
        } else {
          finalNewProducts.push(newProduct);
        }
        return finalNewProducts;
      }, []);
    
    
    
       setNewProducts(newProductsShrinked);
    
      

    },[cartProducts, product, variant, bundleVariants ]);

  



    const bundleBuyNowLink = useMemo(() => {
      const { variantNames, variantQuantities } = bundleVariants.reduce(
        (acc, bv, index) => {
          acc.variantNames += bv.name + (index !== bundleVariants.length - 1 ? ',' : '');
          acc.variantQuantities += bv.quantity + (index !== bundleVariants.length - 1 ? ',' : '');
          return acc;
        },
        { variantNames: '', variantQuantities: '' }
      );
    
      return `/checkout/buynow?productid=${product.id}&variant=${variantNames}&quantity=${variantQuantities}`;
    }, [bundleVariants]);
//moze da se optimizuje





  

  return (
    <>
        <NextSeo {...productPageSeo(product.id)}/>
      <div className={styles.productPageDiv}>
       
          <ProductPics productId={product.id} onAddToCart ={ onAddToCart } images={images} variantImageIndex={variantIndexToZeroRef.current && variant?.variantProductImageIndex} />
      
          <div className={styles.productInfoWrapper}>
       
       
          
          <h1 className={styles.product_title}>{product.name}</h1>
          <div
            className={styles.product_rating}
            onClick={() => {
              document
                .getElementById("customerReviews")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >

        {/* <span className={styles.ratingNumber}>{ratingData.rating.toFixed(1)}</span> */}
            
            <Stars ratingNumber={ratingData.rating?ratingData.rating:4.7} starClassName={styles.starClassName}/>
            <span className={styles.product_rating_reviews_number}>{ratingData.reviewsNumber} reviews</span>
          </div>
          <div className={styles.product_price}>
          ${product.price.toFixed(2)}
            {product.stickerPrice &&
            <>
            <span className={styles.product_price_span}>${product.stickerPrice.toFixed(2)}</span>
            <span className={styles.percentageDiscountSpan}>Sale</span>
            </>
            }
         
         
          </div>

          <div className={styles.inStockDiv}>
            <div className={styles.pulseDiv}><div className={styles.pulser}/></div>
            <span className={styles.inStockSpan}>In stock, ready to ship</span>
          </div>
          {product.variants && <div className={styles .variantDiv}>
          <span className={styles.variantLabel}>Color: {variant.name}</span>
          <div className={styles.product_style_options}>


            {product.variants.map((v, i)=>{
           return   <Image
               key={i}
                src={"/images/" + v.image}
                alt={v.name}
                sizes="(max-width: 980px) 48px, 64px"
                className={`${styles.productVariantImage} ${v.name===variant.name && styles.productVariantSelected}`}
                onClick={() => {

                  
                  variantIndexToZeroRef.current = true;
                  
                  setVariant(v);
                  
                }}
               
                height={0}
                width={0}
              />
           
            })

                }


           
          </div>
          </div>
}

     {product.bundle && <BundleOffer productId={product.id} price={product.price} stickerPrice={product.stickerPrice} bundle={product.bundle} quantity={quantity} 
     setQuantity={setQuantity} mainVariant={variant.name} setBundleVariants={setBundleVariants} allVariants={product.variants.map(v=>v.name)}/> }



          <QuantityButton quantity={quantity} setQuantity={setQuantity} />

         

          <button
          id='addToCart'
            className={`${styles.add_to_cart_button} mainButton`}
            onClick={(event) => {event.stopPropagation();onAddToCart( quantity)}}
         
          >
            Add to Cart
          </button>

            <PayPalButton type='instant' color='gold' organizeUserData={
             useCallback((paymentMethod)=>{
                const email = "";
                const firstName = "";
                const lastName = "";
                const address = "";
                const apt = "";
                const country = "";
                const zipcode = "";
                const state = "";
                const city = "";
                const phone = "";
               
                const items=bundleVariants.length>0?bundleVariants.map(bv =>{
                  return {
                    id: product.id,
                    quantity: bv.quantity,
                    variant: bv.name
                  }
                }):[{
                  id: product.id,
                  quantity: quantity,  
                  variant: variant
                }];
               
                const requestData = {
                  order: {
                    email,
                    firstName,
                    lastName,
                    address,
                    apt,
                    country,
                    zipcode,
                    state,
                    city,
                    phone,
                    couponCode: "",
                    tip: 0,
                    items:items ,
                  },
                  paymentMethod: paymentMethod,
                  paymentToken: undefined
            
                  // Include other payment-related data if required
                };
                return requestData
              }
            
  ,[quantity, variant, bundleVariants])}/>
        


      

<Link className={styles.buy_now_button} 
          href={bundleVariants.length!==0?bundleBuyNowLink:`/checkout/buynow?productid=${product.id}${variant?`&variant=${variant.name}`:""}&quantity=${quantity}`}>
            More payment options
          </Link>


        

          <div className={styles.buyBadges}>
          <Visa styleClassName={styles.creditCardLogo}/>
           <MasterCard styleClassName={styles.creditCardLogo}/>
           <Amex styleClassName={styles.creditCardLogo}/>
           
         
            <Jcb styleClassName={styles.creditCardLogo}/>
            
           <Discover styleClassName={styles.creditCardLogo}/>
          </div>

        

          

          <ProductPageCards description ={description}/>

          <FrequentlyBoughtTogether
            fbtProductInfo={product.fbt}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
      
      
      <CustomerReviews product_id={product.id} startReviews={startReviews} ratingData={ratingData} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: products.map((product) => {
      return { params: { productId: product.name.toLowerCase().replace(/\s+/g, "-") } };
    }),

    fallback: true,
  };
}

export async function getStaticProps(context) {


  const getPool = require('@/utils/mariaDbPool');


  const productName = context.params.productId;
  const product = products.find((p) => {
    return p.name.toLowerCase().replace(/\s+/g, "-") == productName;
  });
  

  if(product===undefined){
    return {
      props: {
        product: null,
        images: null,
        startReviews: null,
        ratingData: null,
      },
    };
  }

  const productId = product.id.toString();
  console.log('my product is', product);

  const images = product.images
    .map((img) => {
      return {
        src: "/images/" + img,
        alt: "product image",
      };
    });



 

 
    const reviewsData= await getStartReviews(productId, 12);

 
    

    
    
    let description = `Product ${productId} description`
    let ratingData={};
    let reviewsNumberFinal = 0;
    let sumOfAllReviews= 0 ;


   
    let mariaDbOnlineStatus;

    let connection;

    try {
      // Set a specific timeout when acquiring a connection
      connection  = await (await getPool()).getConnection();
  
      if(connection)await connection.release();
  
      mariaDbOnlineStatus = true;
    } catch (error) {
      
      if(connection) await connection.release();
        console.log('there is error', error)

      mariaDbOnlineStatus = false;
    }

    console.log('mariaDb status', mariaDbOnlineStatus)



      if(mariaDbOnlineStatus){
    for(let i=1; i <6; i++){
      
      const reviewsNumber = await getRatingData(productId, i);
      ratingData={...ratingData, [`stars${i}`]:reviewsNumber}
      reviewsNumberFinal = reviewsNumberFinal + reviewsNumber;
      sumOfAllReviews=sumOfAllReviews+reviewsNumber*i;

    }

    try {

    connection = await (await getPool()).getConnection();
    const descriptionData= await connection.query(`SELECT description FROM products WHERE productId = ?` , [productId]);
    if(descriptionData.length > 0) description = descriptionData[0].description;

    if(connection)await connection.release();

    }

    catch(error){
      console.log('there is error with db connection', error)
      if(connection)await connection.release();
    }

  }


    const averageValue=reviewsNumberFinal!==0?Math.round(sumOfAllReviews/reviewsNumberFinal * 10)/ 10:4.7;
    if(reviewsNumberFinal===0) ratingData={stars5:30, stars4:2, stars3:0, stars2:0, stars1:0, reviewsNumber: 32, rating: averageValue}
    else {ratingData={...ratingData, reviewsNumber: reviewsNumberFinal, rating: averageValue}}
  // Return the data as props
  return {
    props: {
      product,
      description,
      images,
      startReviews: reviewsData,
      ratingData: ratingData
    },
  };
}



