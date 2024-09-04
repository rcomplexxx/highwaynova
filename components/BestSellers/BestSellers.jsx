import { Swiper, SwiperSlide } from 'swiper/react';


import PicWithThumbnail from '../Products/Product/PicWithThumbnail/PicWithThumbnail';

import bestSellerProductsInfo from '../../data/bestsellers.json';
import styles from './bestsellers.module.css';
import Link from 'next/link';
import {  useEffect, useRef, useState } from 'react';
import products from '@/data/products.json'
import findBestBundle from '@/utils/findBestBundle'

// Import Swiper styles
import "swiper/css";
import { useGlobalStore } from '@/contexts/AppContext';

export default function BestSellers() {
  const sliderRef = useRef();
  const [initialProductNames, setInitialProductNames] = useState([]);




  const { cartProducts, setCartProducts} = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts
  }));


  useEffect(()=>{
   setInitialProductNames(cartProducts.map(product=> product.id));
  },[])
  

  const bestSellerProducts = bestSellerProductsInfo.map((bsp) => {

    


    const product= products.find(p=>{return p.id== bsp.id});

    if(initialProductNames?.includes(product.id))return;

    console.log('item escaped condition', product.id, 'inprnames', initialProductNames);

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





  const onAddToCart = ( quantity = 1,addedProduct, addedVariant) => {
    let updatedCartProducts = [...cartProducts];

    const productIndex = cartProducts.findIndex((cp) => cp.id === addedProduct.id && cp.variant===addedVariant.name);

    if (productIndex !== -1) {

    
      
      updatedCartProducts[productIndex].quantity += quantity;
     
      
  
    } else {
      const newProduct = {
        id: addedProduct.id,
        quantity: quantity,
        name: addedProduct.name,
        image: addedVariant?.variantProductImageIndex>0?addedProduct.images[addedVariant?.variantProductImageIndex]:addedProduct.images[0],
        price: addedProduct.price,
        stickerPrice: addedProduct.stickerPrice,
        variant: addedVariant.name
      };
      updatedCartProducts.push(newProduct);
    }

  
      setCartProducts( findBestBundle(updatedCartProducts));
    
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
            
            
            <Link href={`/products/${bsp.product.name.toLowerCase().replace(/\s+/g, "-")}`} 
            className={styles.productImageLink}>
            
              
                <PicWithThumbnail product={bsp.product} variantImage={bsp.variant.image} />
             
            
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