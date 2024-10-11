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


  

  




  

 

  const [quantity, setQuantity] = useState(1);
  const [bundleVariants, setBundleVariants] = useState([]);

  const baseUrlRef = useRef();

  const shouldInitializeVariantRef = useRef({initialize: false, instant: true});
  




  const { setNewProducts,cartProducts, setCartProducts } = useGlobalStore(state => ({
    setNewProducts: state.setNewProducts,
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));
  


  const router = useRouter();
  

   
  const {variant:variantQuery} = router.query;

   const currentVariant = useMemo(()=>{


    const formatQuery = query => query?.toLowerCase().replace(/\s+/g, "-");

    const currentVariant = variantQuery ? (product?.variants?.find(v => formatQuery(v.name) === formatQuery(variantQuery)) || product.variants?.[0]): product.variants?.[0];
  

    shouldInitializeVariantRef.current = {initialize:!variantQuery || !product?.variants?false:true, instant:true};

    return currentVariant;

   }, [router.query])

   
  const [variant, setVariant]=useState(currentVariant);

  useLayoutEffect(()=>{
    setVariant(currentVariant);
  },[currentVariant])



  useLayoutEffect(() => {

    if(baseUrlRef.current === router.asPath.split('#')[0])return;

    baseUrlRef.current=router.asPath;


    
    setQuantity(1);

    
    
    
  
    
  }, [router.asPath]);




  
  







  const onAddToCart = useCallback((quantity = 1, addedProduct = product, addedVariant = variant) => {

    const updatedCartProducts = [...cartProducts];
    const newProducts = [];
    
    const formatName = name => name?.toLowerCase().replace(/\s+/g, "-");
  
    const newProductsMini = bundleVariants.length ? bundleVariants : [{ name: addedVariant?.name, quantity }];
    
    newProductsMini.forEach(({ name: variantName, quantity: qty }) => {
      const existingProduct = updatedCartProducts.find(cp =>
        cp.id === addedProduct.id && formatName(cp.variant) === formatName(variantName)
      );
  
      if (existingProduct) {
        existingProduct.quantity += qty;
        newProducts.push({ ...existingProduct, quantity: qty });
      } else {
        
        const newProduct = {
          id: addedProduct.id,
          quantity: qty,
          name: addedProduct.name,
          image: addedProduct.images[addedProduct.variants?.find(pv => formatName(pv.name) === formatName(variantName))?.variantProductImageIndex] || addedProduct.images[0],
          price: addedProduct.price,
          stickerPrice: addedProduct.stickerPrice,
          variant: variantName,
        };
        newProducts.push(newProduct);
        updatedCartProducts.push(newProduct);
      }
    });
  
    setCartProducts(updatedCartProducts);
    setNewProducts(newProducts);
  
  }, [cartProducts, product, variant, bundleVariants]);

  







  if (!product) return   <div className={styles.notFoundDiv}>
    
  
  <h1 className={styles.title404}>We don't sell that product anymore</h1>
  <span className={styles.notification404}>But we have many cool things we'd love you to see.</span>
  
  <Link href='/collections' className={`${styles.shopNow} mainButton`}>Check some cool stuff</Link>
  
  </div>


  

  return (
    <>
        <NextSeo {...productPageSeo(product.id)}/>
      <div className={styles.productPageDiv}>
       
          <ProductPics onAddToCart ={ onAddToCart } images={images} variantImageIndex={{
            imageIndex: shouldInitializeVariantRef.current.initialize?(variant?.variantProductImageIndex || 0):0 , 
            instant: shouldInitializeVariantRef.current.instant}} />
      
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
          {variant?.name && <span className={styles.variantLabel}>Color: {variant.name}</span>}
          <div className={styles.product_style_options}>


            {product.variants.map((v, i)=>{
           return   <Image
               key={i}
                src={"/images/" + product.images[v.variantProductImageIndex]}
                alt={v.name}
                sizes="(max-width: 980px) 48px, 64px"
                className={`${styles.productVariantImage} ${v.name.toLowerCase().replace(/\s+/g, "-")===variant?.name.toLowerCase().replace(/\s+/g, "-") && styles.productVariantSelected}`}
                onClick={() => {

                  
                  
                  shouldInitializeVariantRef.current = {initialize:true, instant:false};
                  
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

     {product.bundle && <BundleOffer product={{price: product.price, stickerPrice: product.stickerPrice, bundle: product.bundle, variants: product.variants}} quantity={quantity} 
     setQuantity={setQuantity} mainVariant={variant?.name} setBundleVariants={setBundleVariants}/> }



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

                

               
              
                const items = bundleVariants.length > 0
                ? bundleVariants.map(cp => ({ id: product.id, quantity: cp.quantity, variant: cp.name }))
                : [{ id: product.id, quantity, variant: variant?.name }];

                const totalQuantity = product.bundle && bundleVariants.length > 0 
                ? bundleVariants.reduce((total, cp) => total + cp.quantity, 0) 
                : quantity;

                const bundleDiscount = product.bundle?.findLast(b => totalQuantity >= b.quantity)?.discountPercentage ?? 0;

                
                const clientTotal= ((product.price * (100 -  bundleDiscount) / 100).toFixed(2)  * totalQuantity).toFixed(2)
                
                  
                  
                console.log('order paypal info', bundleDiscount, clientTotal)

                
              
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
        


      
      




        <Link 
  className={styles.buy_now_button} 
  href={bundleVariants.length 
    ? `/checkout/buynow?productid=${product.id}&variant=${bundleVariants.map(bv => bv.name.toLowerCase().replace(/\s+/g, "-")).join(',')}&quantity=${bundleVariants.map(bv => bv.quantity).join(',')}` 
    : `/checkout/buynow?productid=${product.id}${variant ? `&variant=${variant.name.toLowerCase().replace(/\s+/g, "-")}` : ""}&quantity=${quantity}`} 
 
>
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



