import { Swiper, SwiperSlide } from 'swiper/react';


import PicWithThumbnail from '../Products/Product/PicWithThumbnail/PicWithThumbnail';

import bestSellerProductsInfo from '../../data/bestsellers.json';
import styles from './bestsellers.module.css';
import Link from 'next/link';
import {  useRef } from 'react';
import products from '@/data/products.json'

// Import Swiper styles
import "swiper/css";
import { useGlobalStore } from '@/contexts/AppContext';

export default function BestSellers() {
  const sliderRef = useRef();




  const { cartProducts, setCartProducts } = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));
  

  const bestSellerProducts = bestSellerProductsInfo.map((bsp) => {
    const product= products.find(p=>{return p.id== bsp.id});
    let variantName;
    if(bsp.variantIndex){
    variantName =   bsp.variantIndex>0 && bsp.variantIndex<product.variants.length-1? product.variants[bsp.variantIndex].name:product?.variants[0].name;
   
    }

    else{
      variantName= product?.variants ? product?.variants[0].name: undefined;
    }
     const newBsp = {product:product,variantName:variantName};
    return newBsp;
  });

  console.log('context check main', cartProducts,setCartProducts)

  const onAddToCart = ( quantity = 1,addedProduct, addedVariant) => {
    console.log('context check', cartProducts,setCartProducts)
    if(!cartProducts ){ return;}

      if(cartProducts.length===0){
        setCartProducts([{
          id: addedProduct.id,
          quantity: quantity,
          name: addedProduct.name,
          image: addedProduct.images[0],
          price: addedProduct.price,
          stickerPrice: addedProduct.stickerPrice,
          variant: addedVariant
        }]);
      }

    const productIndex = cartProducts.findIndex((cp) => cp.id === addedProduct.id && cp.variant===addedVariant);

    if (productIndex !== -1 ) {
      const updatedCartProducts = [...cartProducts];
      updatedCartProducts[productIndex].quantity += quantity;
     
      setCartProducts(updatedCartProducts);
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
      setCartProducts([...cartProducts, newProduct]);
    }
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

  return (
    <div className={`${styles.mainDiv}`}>
      <h1 className={styles.bestSellersTitle}>You might also like</h1>


      <Swiper {...settings} ref={sliderRef} className={styles.slider}>
        {bestSellerProducts.map((bsp, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            
            
            <Link href={`/products/${bsp.product.name.toLowerCase().replace(/\s+/g, "-")}`} 
            className={styles.productImageLink}>
            
              
                <PicWithThumbnail product={bsp.product} />
             
            
            </Link>

            <span className={styles.productTitle}>{bsp.product.name}</span>
            
            <div className={styles.product_price}>
  ${bsp.product.price.toFixed(2)}
    {bsp.product.stickerPrice && <span className={styles.product_price_span}>${bsp.product.stickerPrice.toFixed(2)}</span>}
   
  </div>


 


            <button onClick={()=>{ onAddToCart(1, bsp.product, bsp.variantName)}} className={styles.addToCartButton}>
            Add
            </button>
            
          </SwiperSlide>
        ))}
    
      </Swiper>
    </div>
  );
}