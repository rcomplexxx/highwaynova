import { Swiper, SwiperSlide } from 'swiper/react';


import PicWithThumbnail from '../Products/Product/PicWithThumbnail/PicWithThumbnail';

import bestSellerProductsInfo from '@/data/bestsellers.json';
import styles from './bestsellers.module.css';
import Link from 'next/link';
import { useState } from 'react';
import products from '@/data/products.json'


// Import Swiper styles
import "swiper/css";
import { useGlobalStore } from '@/contexts/AppContext';

export default function BestSellers() {





  const { cartProducts, setCartProducts} = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts
  }));

  const [initialProducts, setInitialProducts] = useState(cartProducts.map(product=> {return {id:product.id, variant: product.variant}}));







 

  //Ovde moze jos da se optimizuje
  

  const bestSellerProducts = bestSellerProductsInfo
  .reduce((acc, bsp) => {
    const product = products.find(p => p.id === bsp.id);
    if (product && !initialProducts.some(ip => ip.id === bsp.id && ip.variant === product.variants?.[bsp.variantIndex]?.name)) {
      const variant = product.variants?.[bsp.variantIndex] || product.variants?.[0];
      acc.push({ ...product, variant });
    }
    return acc;
  }, [])
  .slice(0, 4);





  




  const onAddToCart = (addedProduct) => {
    const updatedCartProducts = [...cartProducts];
    const product = updatedCartProducts.find(
      (cp) => cp.id === addedProduct.id && cp.variant === addedProduct.variant?.name
    );

    console.log('current product', addedProduct)
  
    if (product) {
      product.quantity += 1;
    } else {
      updatedCartProducts.push({
        id: addedProduct.id,
        quantity: 1,
        name: addedProduct.name,
        image:  addedProduct.images[addedProduct.variant?.variantProductImageIndex || 0],
        price: addedProduct.price,
        stickerPrice: addedProduct.stickerPrice,
        variant: addedProduct.variant?.name,
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


      <Swiper {...settings} className={styles.slider}>


        {bestSellerProducts.map((bsp, index) => {

         
         return <SwiperSlide key={index} className={styles.slide}>
            
            
            <Link href={`/products/${bsp.name.toLowerCase().replace(/\s+/g, "-")}${bsp.variant? '?variant='+bsp.variant.name.toLowerCase().replace(/\s+/g, "-"): ''}`} 
            className={styles.productImageLink}>
            
              
                <PicWithThumbnail product={bsp} variantImage={bsp.images[bsp.variant?.variantProductImageIndex || 0]} />
             
            
            </Link>

            <span className={styles.productTitle}>{bsp.name}</span>

           {bsp.variant && <span className={styles.productVariant}>{bsp.variant.name}</span>}
            
            <div className={styles.product_price}>
  ${bsp.price.toFixed(2)}
    {bsp.stickerPrice && <span className={styles.product_price_span}>${bsp.stickerPrice.toFixed(2)}</span>}
   
  </div>


 


            <button onClick={()=>{ onAddToCart(bsp)}} className={styles.addToCartButton}>
            Add
            </button>
            
          </SwiperSlide>
})}
    
      </Swiper>
    </div>
  );
}