import { Swiper, SwiperSlide } from 'swiper/react';


import PicWithThumbnail from '../Products/Product/PicWithThumbnail/PicWithThumbnail';

import bestSellerProductsInfo from '../../data/bestsellers.json';
import styles from './bestsellers.module.css';
import Link from 'next/link';
import {  useEffect, useRef, useState } from 'react';
import products from '@/data/products.json'


// Import Swiper styles
import "swiper/css";
import { useGlobalStore } from '@/contexts/AppContext';

export default function BestSellers() {
  const sliderRef = useRef();
  const [initialProducts, setInitialProducts] = useState([]);




  const { cartProducts, setCartProducts} = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts
  }));


  useEffect(()=>{
   setInitialProducts(cartProducts.map(product=> {return {id:product.id, variant: product.variant}}));
  },[])
  

  const bestSellerProducts = bestSellerProductsInfo.map((bsp) => {

    


    const product= products.find(p=>{return p.id== bsp.id});

    console.log('intialPr', initialProducts, bsp)

    if(!product)return;

    if(initialProducts.find(ip => {
      return ip.id === bsp.id && ip.variant === product.variants[bsp.variantIndex].name
    })) return;

    

    console.log('item escaped condition', product.id, 'inprnames', initialProducts);

    let variant;
    if(bsp.variantIndex){
    variant =   bsp.variantIndex>0 && bsp.variantIndex<product.variants.length? product.variants[bsp.variantIndex]:product?.variants[0];
   
    }

    else{
      variant= product?.variants ? product?.variants[0]: undefined;
    }
     return {product:product,variant:variant};
   
  }).filter(Boolean).slice(0, 4);

  console.log('context check main', cartProducts,setCartProducts)





  const onAddToCart = (quantity = 1, addedProduct, addedVariant) => {
    const updatedCartProducts = [...cartProducts];
    const product = updatedCartProducts.find(
      (cp) => cp.id === addedProduct.id && cp.variant === addedVariant.name
    );
  
    if (product) {
      product.quantity += quantity;
    } else {
      updatedCartProducts.push({
        id: addedProduct.id,
        quantity,
        name: addedProduct.name,
        image: addedVariant?.variantProductImageIndex > 0
          ? addedProduct.images[addedVariant.variantProductImageIndex]
          : addedProduct.images[0],
        price: addedProduct.price,
        stickerPrice: addedProduct.stickerPrice,
        variant: addedVariant.name,
      });
    }
  
    setCartProducts(updatedCartProducts);
  };

 

  const settings = {
    speed: 400,
    slidesPerView: "auto",
  
    
    
    breakpoints: {

      980: {
        spaceBetween: 24
      },

      600: {
        spaceBetween: 16
      },

      0:{
        spaceBetween: 12
      }
     
    },
   
    variableWidth: false,
    centeredSlides: false,
    loop: false,
  };


  console.log('bsp final', bestSellerProducts)


  if(bestSellerProducts?.length===0) return <></>;

  return (
    <div className={`${styles.mainDiv}`}>
      <h1 className={styles.bestSellersTitle}>You might also like</h1>


      <Swiper {...settings} ref={sliderRef} className={styles.slider}>
        {bestSellerProducts.map((bsp, index) => {

         
         return <SwiperSlide key={index} className={styles.slide}>
            
            
            <Link href={`/products/${bsp.product.name.toLowerCase().replace(/\s+/g, "-")}${bsp.variant? '?variant='+bsp.variant.name.toLowerCase().replace(/\s+/g, "-"): ''}`} 
            className={styles.productImageLink}>
            
              
                <PicWithThumbnail product={bsp.product} variantImage={bsp.product.images[bsp.variant?.variantProductImageIndex || 0]} />
             
            
            </Link>

            <span className={styles.productTitle}>{bsp.product.name}</span>

           {bsp.variant && <span className={styles.productVariant}>{bsp.variant.name}</span>}
            
            <div className={styles.product_price}>
  ${bsp.product.price.toFixed(2)}
    {bsp.product.stickerPrice && <span className={styles.product_price_span}>${bsp.product.stickerPrice.toFixed(2)}</span>}
   
  </div>


 


            <button onClick={()=>{ onAddToCart(1, bsp.product, bsp.variant)}} className={styles.addToCartButton}>
            Add
            </button>
            
          </SwiperSlide>
})}
    
      </Swiper>
    </div>
  );
}