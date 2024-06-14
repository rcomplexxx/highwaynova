import  { useCallback, useEffect, useMemo, useRef } from "react";
import products from "../../data/products.json";
import Image from "next/image";
import {useGlobalStore} from "@/contexts/AppContext";
import CustomerReviews from "@/components/CustomerReviews/CustomerReviews.jsx";
// import Carousel from "react-gallery-carousel";
// import "react-gallery-carousel/dist/index.css";

import { useState} from "react";
import styles from "../../styles/productpage.module.css";


import QuantityButton from "@/components/QuantityButton/QuantityButton";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether/FrequentlyBoughtTogether";

import ProductPageCards from "@/components/ProductPageCards/ProductPageCards";

import ProductPics from "@/components/ProductPics/ProductPics";

import { getReviewsData } from "@/utils/getStartReviews";
import getRatingData from "@/utils/getRatingData";
import PayPalButton from "@/components/Checkout/PayPal/PayPal";
import { NextSeo } from "next-seo";
import { productPageSeo } from "@/utils/SEO-configs/next-seo.config";
import ProductDescription from "@/components/ProductDescription2/ProductDescription";
import { Stars } from "@/public/images/svgs/svgImages";
import { Amex,Discover, Jcb, MasterCard, Visa } from "@/public/images/svgs/svgImages";
import Link from "next/link";

//slickGoTo
//afterChange(index)=>{}
//Alice~~!
//activeIndex : Number, default 0 - Set carousel at the specified position.
//onUpdated={(e) => { e.item je index

export default function ProductPage({ product, images, startReviews, ratingData }) {
  if (!product) return <p className={styles.notFound}>Product not found.</p>;
 

  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant]=useState(product.variants && product.variants[0].name);

  
  const stopVariantImageChange = useRef(false);




  const { setNewProduct,cartProducts, setCartProducts } = useGlobalStore(state => ({
    setNewProduct: state.setNewProduct,
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));
  



  useEffect(()=>{
    stopVariantImageChange.ref = true;
      setVariant(product.variants && product.variants[0].name);
      setQuantity(1);
  },[product])



  const onAddToCart = useCallback(( quantity = 1,addedProduct=product, addedVariant=variant) => {

    let updatedCartProducts = [...cartProducts];

    const productIndex = cartProducts.findIndex((cp) => cp.id === addedProduct.id && cp.variant===addedVariant);

    if (productIndex !== -1) {
     
      
      updatedCartProducts[productIndex].quantity += quantity;
      setNewProduct(updatedCartProducts[productIndex]);
  
    } else {
      const newProduct = {
        id: addedProduct.id,
        quantity: quantity,
        name: addedProduct.name,
        image: addedProduct.images[0],
        price: addedProduct.price,
        stickerPrice: addedProduct.stickerPrice,
        variant: addedVariant
      };
      updatedCartProducts.push(newProduct);
      setNewProduct(newProduct);
    }

  
      setCartProducts( updatedCartProducts);
    
      

    },[cartProducts, product, variant, ]);

  

  const variantImageIndex = useMemo(()=>{
    if(stopVariantImageChange.ref){stopVariantImageChange.ref=false; return;}
    return product.variants && product.variants.find((v)=>{return v.name==variant})?.variantProductImageIndex;
  },[variant])
  

  return (
    <>
        <NextSeo {...productPageSeo(product.id)}/>
      <div className={styles.productPageDiv}>
       
          <ProductPics productId={product.id} onAddToCart ={ onAddToCart } images={images} variantImageIndex={variantImageIndex} />
      
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
          <span className={styles.variantLabel}>Color: {variant}</span>
          <div className={styles.product_style_options}>
            {product.variants.map((v, i)=>{
           return   <Image
               key={i}
                src={"/images/" + v.image}
                alt={v.name}
                sizes="(max-width: 980px) 48px, 64px"
                className={`${styles.productVariantImage} ${v.name===variant && styles.productVariantSelected}`}
                onClick={() => {
                
                  setVariant(v.name);
                }}
               
                height={0}
                width={0}
              />
           
            })

}
           
          </div>
          </div>
}

          <QuantityButton quantity={quantity} setQuantity={setQuantity} />

         

          <button
          id='addToCart'
            className={styles.add_to_cart_button}
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
               
                const items=[{
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
            
  ,[])}/>
        


          <Link className={styles.buy_now_button} 
          href={`/checkout/buynow?productid=${product.id}${variant?`&variant=${variant}`:""}&quantity=${quantity}`}>
            Buy it now
          </Link>


        

          <div className={styles.buyBadges}>
          <Visa styleClassName={styles.creditCardLogo}/>
           <MasterCard styleClassName={styles.creditCardLogo}/>
           <Amex styleClassName={styles.creditCardLogo}/>
           
         
            <Jcb styleClassName={styles.creditCardLogo}/>
            
           <Discover styleClassName={styles.creditCardLogo}/>
          </div>

          <FrequentlyBoughtTogether
            fbtProductInfo={product.fbt}
            onAddToCart={onAddToCart}
          />

          

          <ProductPageCards description ={product.description}/>
        </div>
      </div>
      
      
      {/* <CustomerReviews product_id={product.id} startReviews={startReviews} ratingData={ratingData} /> */}
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


    const reviewsData= getReviewsData(productId);

    if ('supplierPrice' in product) {
      // Remove the property
      delete product.supplierPrice;
    }
    
    

    let ratingData={};
    let reviewsNumberFinal = 0;
    let sumOfAllReviews= 0 ;
    for(let i=1; i <6; i++){
      const reviewsNumber = getRatingData(productId, i);
      ratingData={...ratingData, [`stars${i}`]:reviewsNumber}
      reviewsNumberFinal = reviewsNumberFinal + reviewsNumber;
      sumOfAllReviews=sumOfAllReviews+reviewsNumber*i;
    }
    const averageValue=reviewsNumberFinal!==0?Math.round(sumOfAllReviews/reviewsNumberFinal * 10)/ 10:4.7;
    if(reviewsNumberFinal===0) ratingData={stars5:386, stars4:60, stars3:0, stars2:1, stars1:2, reviewsNumber: 449, rating: averageValue}
    else{ratingData={...ratingData, reviewsNumber: reviewsNumberFinal, rating: averageValue}}
  // Return the data as props
  return {
    props: {
      product,
      images,
      startReviews: reviewsData,
      ratingData: ratingData
    },
  };
}



