import styles from "./productmobilepics.module.css";

import dynamic from "next/dynamic";
import { useCallback, useEffect,   useLayoutEffect,   useRef,   useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import FullScreenZoomableImage from "./FullScreenZoomableImages/FullScreenZoomableImages";
import { ArrowDown, ZoomInIcon } from "@/public/images/svgs/svgImages";



export default function ProductPics({ images, onAddToCart, variantImageIndex }) {
  const [imageIndex, setImageIndex] = useState(variantImageIndex);
  const [zoomed, setZoomed] = useState(undefined);
  
 
  const [spawnAddToCart, setSpawnAddToCart] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [swiperMini, setSwiperMini] = useState(null);

  const router = useRouter();
  
 
  
  const instantSwapRef = useRef(true);
  
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


  




  useLayoutEffect(() => {
    const addToCartEl = document.getElementById("addToCart");
    const masonryEl = document.getElementById("masonry");

    const checkSpawnAddToCart = () => {
        return (
            addToCartEl.getBoundingClientRect().bottom < 0 &&
            masonryEl.getBoundingClientRect().bottom > window.innerHeight
        );
    };

    setSpawnAddToCart(checkSpawnAddToCart());

    let destroyFixedCartTimeout;

    const handleScroll = () => {
   
      

        if (checkSpawnAddToCart()) {
            setSpawnAddToCart(true);

            if (destroyFixedCartTimeout) {
                clearTimeout(destroyFixedCartTimeout);
                destroyFixedCartTimeout = null;
            }
            
        } else if (fixedAddToCartRef.current) {

            fixedAddToCartRef.current.style.opacity = 0;
            fixedAddToCartRef.current.style.transform = 'translateY(100%)';
            destroyFixedCartTimeout = setTimeout(() => {setSpawnAddToCart(false); }, 300);

        }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        if (destroyFixedCartTimeout) clearTimeout(destroyFixedCartTimeout); // Clean up the timeout
    };
}, []);

  

useLayoutEffect(()=>{

  instantSwapRef.current=true;
}, [router.asPath])




  useLayoutEffect(()=>{

    console.log('activated', variantImageIndex);
  
    
      if(variantImageIndex!==undefined && variantImageIndex>-1 && variantImageIndex < images.length){


        swiper?.slideTo(variantImageIndex, instantSwapRef.current?0:400);
        
      }
      
      
    },[variantImageIndex,swiper])


  

 
 



 
 //Ova dva se rucno menjaju

  const handleSlideChangeEffect = useCallback((swiper) => {
    
    const index = swiper.activeIndex;
    setImageIndex(index);
    swiperMini.slideTo(index, instantSwapRef.current?0:400);
    instantSwapRef.current=false;
 
  }, [imageIndex, swiper, swiperMini]);






  const handleChangeImage = useCallback((imageIndex, smooth=false)=>{
            
    if(smooth)
      swiper.slideTo(imageIndex);
   else
    swiper.slideTo(imageIndex, 0, false);
   
   
   },[swiper])




    



  return (
    <>
       
   
      

    
      <div className={styles.productPicsWrapper}>
        <div className={styles.productImagesWrapper}>
        
        <Swiper  onSwiper={setSwiper} speed={400} slidesPerView='auto' onSlideChange={handleSlideChangeEffect}
       
       initialSlide={variantImageIndex}
        preventClicks={false}
        // preventClicksPropagation={false}
        touchStartPreventDefault={false}
     

        >


      {images.map((img, index) => (
       
        <SwiperSlide key={index}   
        className={`carousel-item ${styles.slide} ${index===images.length-1 && styles.lastSlide}`}
       >
         
            <Image
            id={`mainImage${index}`}
            
            onClick={() => {
              setZoomed(true);
            }}
           

            height={0}
            width={0}
              className={`${styles.productImage} ${index===imageIndex && styles.selectedMainImage}`}
              src={img.src}
              alt={img.alt}

              sizes="(max-width: 980px) 100vw, 768px"
             
              priority={index === 0}
              loading={index === 0?'eager':undefined}
              draggable="false"
            />
           {imageIndex===index && <ZoomInIcon 
           color="var(--swiper-zoomin-icon-color)"
           styleClassName={styles.zoomImg} handleClick={()=>{}}/>}
         
        </SwiperSlide>
       
      ))}
    </Swiper>

    
        <div className={styles.slider2Suiter}>



        <ArrowDown color={'var(--mini-slider-arrow-color)'}
         handleClick={()=>{handleChangeImage(imageIndex - 1, true)}} 
            
            styleClassName={`${styles.leftArrowDiv} ${imageIndex===0 && styles.disabledArrow}`}/>
          
   



            <ArrowDown color={'var(--mini-slider-arrow-color)'}
            handleClick={()=>{handleChangeImage(imageIndex+1, true)}} 
            
            styleClassName={`${styles.leftArrowDiv} ${styles.rightArrowDiv} ${imageIndex===images.length-1 && styles.disabledArrow}`}/>
           

           


            
        <Swiper  slidesPerView="auto" speed={400} 

        initialSlide={variantImageIndex}
  
    className={styles.slider2} onSwiper={setSwiperMini}>
           
          {images.map((img, index) => (
            <SwiperSlide key={index}  className={`carousel-item ${styles.slide2}`}
            
            onClick={() => {
              handleChangeImage(index, true)
            }}
            >
              
                <Image
                  className={`${styles.productImage} ${imageIndex === index && styles.selectedImage}`}
                  src={img.src}
                  alt={img.alt}
                  sizes="25vw"
                  // loading={index>2?'lazy':undefined}
                 
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
             
                
                  <Image
                  key={index}
                    className={`${styles.productImage} ${styles.productImage2Div} ${
                      imageIndex == index && styles.selectedImage
                    }`}
                    onClick={() => {handleChangeImage(index, window.innerWidth<980) }}
                    src={img.src}
                    alt={img.alt}
                    sizes="20vw"
                    height={0}
                    width={0}
                    loading={'lazy'}
                    draggable="false"
                  />
              
                  
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
