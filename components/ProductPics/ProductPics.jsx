import styles from "./productmobilepics.module.css";

import dynamic from "next/dynamic";
import { useCallback, useEffect,   useRef,   useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import FullScreenZoomableImage from "./FullScreenZoomableImages/FullScreenZoomableImages";
import { ArrowDown } from "@/public/images/svgs/svgImages";

// const FullScreenZoomableImage = dynamic(() => import('@/components/ProductPics/FullScreenZoomableImages/FullScreenZoomableImages'));


export default function ProductPics({ images, onAddToCart, variantImageIndex }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(undefined);
  
 
  const [spawnAddToCart, setSpawnAddToCart] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [swiperMini, setSwiperMini] = useState(null);

  const router = useRouter();
  const variantImageIndexMountedRef=useRef(false);
  const fixedAddToCartRef= useRef();

  useEffect(() => {
    if(zoomed===undefined){
      if(router.asPath.includes("#zoom"))
      router.push(router.asPath.split('#zoom')[0]);
     
      return;
    }

    
    if (zoomed) {
      if(!router.asPath.includes("#zoom"))router.push(router.asPath + "#zoom");

   


     

    } else { 
    if (router.asPath.includes("#zoom")) {document.documentElement.classList.remove("hideScroll");  router.back();}
  }

   
  }, [zoomed]);


  
 

  useEffect(() => {
   
    




    
    const AddToCartEl = document.getElementById("addToCart");
    const  masonryEl = document.getElementById("masonry");
    
    setSpawnAddToCart(AddToCartEl.getBoundingClientRect().bottom < 0 && masonryEl.getBoundingClientRect().bottom > window.innerHeight);
    
    let destroyFixedCartTimeout;
   
    const handleScroll = () => {
      const shouldSpawn= AddToCartEl.getBoundingClientRect().bottom < 0 && masonryEl.getBoundingClientRect().bottom > window.innerHeight;
      
      if(shouldSpawn){
        setSpawnAddToCart(true)
      if(destroyFixedCartTimeout){
        clearTimeout(destroyFixedCartTimeout);
        destroyFixedCartTimeout=null;
      }
    }
    else{
      if(fixedAddToCartRef.current){
      fixedAddToCartRef.current.style.opacity=0;
      fixedAddToCartRef.current.style.transform='translateY(100%)';
      destroyFixedCartTimeout= setTimeout(()=>{
        setSpawnAddToCart(false);
      },300)
    }
    }
      
    };

   

    

  

    window.addEventListener("scroll", handleScroll);
   
     
    return () => {
      window.removeEventListener("scroll", handleScroll);
     
    };
  }, []);

  
  

  useEffect(()=>{
    
    if(variantImageIndex && variantImageIndex>=-1 && variantImageIndex < images.length && variantImageIndexMountedRef.current){
      swiper?.slideTo(variantImageIndex,window.innerWidth<980?400:0);
      
    }
    variantImageIndexMountedRef.current=true;
  },[variantImageIndex])

  
  useEffect(()=>{
    swiper && swiper.slideTo(0, 400);
  },[images])

 
 

  const handleSlideChange = useCallback((swiper) => {
    
    const index = swiper.activeIndex;
    setImageIndex(index);
    if (index < imageIndex) swiperMini.slideTo(index);
    else swiperMini.slideTo(index - 1);
  }, [imageIndex, swiperMini]);



 

  


  const handleChangeImage = useCallback((imageIndex)=>{
            
    swiper.slideTo(imageIndex, 0, false);
    setImageIndex(imageIndex)},[swiper])

  return (
    <>
       
   
      

    
      <div id="productPics" className={styles.productPicsWrapper}>
        <div
          id="productImages"
          className={styles.productImagesWrapper}
        >
        
        <Swiper  onSwiper={setSwiper} speed={400} slidesPerView='auto' onSlideChange={handleSlideChange}
       

   
 
        preventClicks={false}
        // preventClicksPropagation={false}
        touchStartPreventDefault={false}
     

        >
      {images.map((img, index) => (
       
        <SwiperSlide key={index}  onClick={() => {
              setZoomed(true);
            }}  className={`carousel-item ${styles.slide} ${index==images.length-1 && styles.lastSlide}`}
       >
         
            <Image
            id={`mainImage${index}`}
            
           

            height={0}
            width={0}
              className={styles.productImage}
              src={img.src}
              alt={img.alt}
              sizes="(max-width: 980px) 100vw, 576px"
             
              priority={index == imageIndex}
              loading={index==imageIndex?'eager':undefined}
              draggable="false"
            />
           {imageIndex==index && <Image
          
          
           alt="Zoom in"
              height={0}
              width={0}
              sizes="20px"
              
              className={styles.zoomImg}
              src={"/images/zoomIconAw.png"}
              loading={'lazy'}
            />}
         
        </SwiperSlide>
       
      ))}
    </Swiper>
        <div className={styles.slider2Suiter}>



        <ArrowDown color={'var(--mini-slider-arrow-color)'}
        handleClick={()=>{ swiper.slideTo(imageIndex-1);}} 
            
            styleClassName={`${styles.leftArrowDiv} ${imageIndex===images.length-1 && styles.disabledArrow}`}/>
          
   



            <ArrowDown color={'var(--mini-slider-arrow-color)'}
            handleClick={()=>{swiper.slideTo(imageIndex+1)}} 
            
            styleClassName={`${styles.leftArrowDiv} ${styles.rightArrowDiv} ${imageIndex===images.length-1 && styles.disabledArrow}`}/>
           

           


            
        <Swiper  slidesPerView="auto" speed={400} 
  
    className={styles.slider2} onSwiper={setSwiperMini}>
           
          {images.map((img, index) => (
            <SwiperSlide key={index}  className={`carousel-item ${styles.slide2}`}
            
            onClick={() => {
              swiper.slideTo(index);
              setImageIndex(index);
            }}
            >
              
                <Image
                  className={`${styles.productImage} ${imageIndex === index && styles.selectedImage}`}
                  src={img.src}
                  alt={img.alt}
                  sizes="25vw"
                 
                  height={0}
                  width={0}
                  draggable="false"
                />
             
            </SwiperSlide>
          ))}
        </Swiper>
      
    </div>
 <div className={styles.grid_container}>
            {images.map((img, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    swiper.slideTo(index, 0);
                    setImageIndex(index);
                  }}
                  className={`${styles.productImage2Div}`}
                >
                  <Image
                    className={`${styles.productImage} ${
                      imageIndex == index && styles.selectedImage
                    }`}
                    src={img.src}
                    alt={img.alt}
                    sizes="20vw"
                    height={0}
                    width={0}
                    loading={'lazy'}
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
     

 {spawnAddToCart && <div ref={fixedAddToCartRef} className={`${styles.fixedAddToCartDiv}`}
  onClick={(event)=>{event.stopPropagation();onAddToCart()}}>Add to cart
        </div>
}

       
       {zoomed && <FullScreenZoomableImage
       
          imageIndex={imageIndex}
         
          changeImageIndex={handleChangeImage}
            
         
          fullScreenChange={setZoomed}
          images={images}
        />
       }
      
     
    </>
  );
}
