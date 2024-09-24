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

import { getStartReviews } from "@/utils/utils-server/getStartReviews";
import getRatingData from "@/utils/utils-server/getRatingData";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { productPageSeo } from "@/utils/SEO-configs/next-seo.config";

import { Stars } from "@/public/images/svgs/svgImages";
import { Amex,Discover, Jcb, MasterCard, Visa } from "@/public/images/svgs/svgImages";
import Link from "next/link";

import styles from "../../styles/productpage.module.css";
import BundleOffer from "@/components/ProductPage/BundleOffer/BundleOffer";
import { useRouter } from "next/router";
import getConnection from "@/utils/utils-server/mariaDbConnection";

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
  


  const router = useRouter();
  const { query } = router; 




  useLayoutEffect(()=>{

    console.log('this effect reactivated')

    if(!product.variants)return;
    
   
    const variantByQuery = query.variant;

    if(variantByQuery){


      variantIndexToZeroRef.current = true;

      const currentVariant = product.variants?.find(v =>{return v.name.toLowerCase().replace(/\s+/g, "-") === variantByQuery});


        setVariant(currentVariant?currentVariant:product.variants[0]);


    }
    else{

      variantIndexToZeroRef.current = false;
      setVariant(product.variants[0]);
     
    }

     
      setQuantity(1);

      
      

  },[product.id, query])







  const onAddToCart = useCallback((quantity = 1, addedProduct = product, addedVariant = variant) => {
    const updatedCartProducts = [...cartProducts];
    const newProducts = [];
  
    const formatName = name => name.toLowerCase().replace(/\s+/g, "-");
  
    const addNewProduct = (variantName, qty) => {
      const existingProduct = updatedCartProducts.find(cp =>
        cp.id === addedProduct.id &&
        formatName(cp.variant) === formatName(variantName)
      );
  
      if (existingProduct) {
        existingProduct.quantity += qty;
        newProducts.push({ ...existingProduct, quantity: qty });
      } else {
        const variantObj = product.variants.find(pv => formatName(pv.name) === formatName(variantName)) || {};
        const newProduct = {
          id: addedProduct.id,
          quantity: qty,
          name: addedProduct.name,
          image: addedProduct.images[variantObj.variantProductImageIndex] || addedProduct.images[0],
          price: addedProduct.price,
          stickerPrice: addedProduct.stickerPrice,
          variant: variantName,
        };
        newProducts.push(newProduct);
        updatedCartProducts.push(newProduct);
      }
    };
  
    const newProductsMini = bundleVariants.length ? bundleVariants : [{ name: addedVariant.name, quantity }];
    newProductsMini.forEach(({ name, quantity }) => addNewProduct(name, quantity));
  
    setCartProducts(updatedCartProducts);
    setNewProducts(newProducts);
  }, [cartProducts, product, variant, quantity, bundleVariants]);

  






    const bundleBuyNowLink = useMemo(() => {
      const { variantNames, variantQuantities } = bundleVariants.reduce(
        (acc, bv, index) => {
          acc.variantNames += bv.name.toLowerCase().replace(/\s+/g, "-") + (index !== bundleVariants.length - 1 ? ',' : '');
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
                src={"/images/" + product.images[v.variantProductImageIndex]}
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

            <PayPalButton type='instant' color='gold' organizeUserDataArg={
               useCallback((paymentMethod) => {



                const defaultFields = {
                  email: "",
                  firstName: "",
                  lastName: "",
                  address: "",
                  apt: "",
                  country: "",
                  zipcode: "",
                  state: "",
                  city: "",
                  phone: ""
                };

                

               
              
                let items = [{ id: product.id, quantity, variant: variant.name }];
                let clientTotal = (product.price * quantity).toFixed(2);
                
                if (bundleVariants.length > 0) {
                  const bundleQuantity = bundleVariants.reduce((total, cp) => total + cp.quantity, 0);
                  items = bundleVariants.map(cp => ({ id: product.id, quantity: cp.quantity, variant: cp.name }));
                
                  const bundleIndex = product.bundle.findIndex(b => b.quantity > bundleQuantity);
                  const discountIndex = bundleIndex === -1 ? product.bundle.length - 1 : bundleIndex - 1;
                  const discountPercentage = product.bundle[discountIndex].discountPercentage;
                
                  clientTotal = 
                    bundleVariants.reduce((sum, bv) => 
                      sum + parseFloat((product.price * (100 - discountPercentage) / 100).toFixed(2))  * bv.quantity
                    , 0).toFixed(2);
                  
                  
                } else if (product.bundle) {
                  const lastBundle = product.bundle[product.bundle.length - 1];
                  if(quantity > lastBundle.quantity)
                    clientTotal= ( parseFloat((product.price * (100 - lastBundle.discountPercentage) / 100).toFixed(2))  * quantity).toFixed(2)
                    
                
                  
                }
                
                
                
                  
                  

                
              
                const requestData = {
                  order: {
                    ...defaultFields,
                    items,
                    customerSubscribed: false,
                    couponCode: "",
                    tip: "0.00",
                    
                    clientTotal: clientTotal
                  },
                  paymentMethod,
                  paymentToken: undefined
                  // Include other payment-related data if required
                };
              
                return requestData;
              }
            
  ,[quantity, variant, bundleVariants])}/>
        


      

<Link className={styles.buy_now_button} 
          href={bundleVariants.length!==0?bundleBuyNowLink:`/checkout/buynow?productid=${product.id}${variant?`&variant=${variant.name.toLowerCase().replace(/\s+/g, "-")}`:""}&quantity=${quantity}`}  shallow>
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



 


    
  
    

     const ratingData = await getRatingData(productId);

     const reviewsData= await getStartReviews(productId, 12);
   
    
  let description =  `Product ${productId} description`;

    


  let dbConnection;

    try {

    dbConnection = await getConnection();
    const descriptionData= await dbConnection.query(`SELECT description FROM products WHERE productId = ?` , [productId]);

    if(descriptionData.length > 0) description = descriptionData[0].description;


    }

    catch(error){
      console.log('there is error with db connection', error)
      
    }

    finally{
      if(dbConnection)await dbConnection.end();
    }




  

  

  



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



