import styles from "./productmobilepics.module.css";


import { useCallback, useEffect,   useLayoutEffect,   useRef,   useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import FullScreenZoomableImage from "./FullScreenZoomableImages/FullScreenZoomableImages";
import { ArrowDown, ZoomInIcon } from "@/public/images/svgs/svgImages";



export default function ProductPics({ images, onAddToCart, variantImageIndex }) {
  const [imageIndex, setImageIndex] = useState(variantImageIndex.imageIndex);
  const [fullScreenOn, setFullScreenOn] = useState(undefined);
  
 
  const [spawnAddToCart, setSpawnAddToCart] = useState(false);
 
  
  

  const router = useRouter();

  const  swiperRef = useRef(), swiperMiniRef = useRef();
  
  const instantSwipeRef = useRef(variantImageIndex.instant)
  
  const fixedAddToCartRef= useRef();


  
  useEffect(() => {
    if (fullScreenOn === undefined && router.asPath.includes("#zoom")) router.replace(router.asPath.replace("#zoom", ""));
      
 
  }, [fullScreenOn]);






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

  

  if (variantImageIndex.imageIndex===imageIndex)return;

  instantSwipeRef.current=variantImageIndex.instant;
  setImageIndex(variantImageIndex.imageIndex);

},[variantImageIndex.imageIndex])









    useLayoutEffect(()=>{

     if(swiperRef.current?.activeIndex!==imageIndex) swiperRef.current?.slideTo(imageIndex, instantSwipeRef.current?0:400, false);
     if(swiperMiniRef.current?.activeIndex!==imageIndex) swiperMiniRef.current?.slideTo(imageIndex, instantSwipeRef.current?0:400, false);
     
     instantSwipeRef.current=false;

    },[imageIndex])


  

 
 



 
 //Ova dva se rucno menjaju

  const handleSlideChangeEffect = useCallback(() => {
    
    const index = swiperRef.current?.activeIndex;
    setImageIndex(index);
    
   
    
 
  }, [imageIndex]);






  const handleChangeImage = useCallback((imageIndex, instant)=>{

    instantSwipeRef.current= instant;
            
    setImageIndex(imageIndex)
   
   
   },[])




    



  return (
    <>
       
   
      

    
      <div className={styles.productPicsWrapper}>
        <div className={styles.productImagesWrapper}>
        
        <Swiper  onSwiper={(swiperInstance) => {
        swiperRef.current = swiperInstance;  // Store Swiper instance in ref
      }}
      
      speed={400} slidesPerView='auto' onSlideChange={handleSlideChangeEffect}
       
       initialSlide={variantImageIndex.imageIndex}
        preventClicks={false}
        // preventClicksPropagation={false}
        touchStartPreventDefault={false}
        preloadImages={false}
        lazy={true}
        
        

        >


      {images.map((img, index) => (
       
        <SwiperSlide key={index}   
        className={`carousel-item ${styles.slide} ${index===images.length-1 && styles.lastSlide}`}
       >
         
            <Image
            id={`mainImage${index}`}
            
            onClick={() => {
              if(!global.isRouteProcessing)
              setFullScreenOn(true);
            }}
           

            height={0}
            width={0}
              className={`${styles.productImage} ${index===imageIndex && styles.selectedMainImage}`}
              src={img.src}
              alt={img.alt}

              sizes="(max-width: 980px) 100vw, 768px"
             
              priority={index === (variantImageIndex.imageIndex ?? 0)}
              loading={index === (variantImageIndex.imageIndex ?? 0)?'eager':undefined}
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
         handleClick={()=>{handleChangeImage(imageIndex - 1)}} 
            
            styleClassName={`${styles.leftArrowDiv} ${imageIndex===0 && styles.disabledArrow}`}/>
          
   



            <ArrowDown color={'var(--mini-slider-arrow-color)'}
            handleClick={()=>{handleChangeImage(imageIndex+1)}} 
            
            styleClassName={`${styles.leftArrowDiv} ${styles.rightArrowDiv} ${imageIndex===images.length-1 && styles.disabledArrow}`}/>
           

           


            
        <Swiper  slidesPerView="auto" speed={400} 

        initialSlide={variantImageIndex.imageIndex}
  
    className={styles.slider2} 
    
    onSwiper={(swiperMiniInstance) => {
      swiperMiniRef.current = swiperMiniInstance;  // Store Swiper instance in ref
    }}
    >
           
          {images.map((img, index) => (
            <SwiperSlide key={index}  className={`carousel-item ${styles.slide2}`}
            
            onClick={() => {
              handleChangeImage(index)
            }}
            >
              
                <Image
                  className={`${styles.productImage} ${imageIndex === index && styles.selectedImage}`}
                  src={img.src}
                  alt={img.alt}
                  sizes="25vw"
                  // loading={index>2?'lazy':undefined}
                  priority={index === (variantImageIndex.imageIndex ?? 0)}
                  loading={index === (variantImageIndex.imageIndex ?? 0)?'eager':undefined}
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
                    onClick={() => {handleChangeImage(index, window.innerWidth>=980) }}
                    src={img.src}
                    alt={img.alt}
                    sizes="20vw"
                    height={0}
                    width={0}
                    priority={index === (variantImageIndex.imageIndex ?? 0)}
                    loading={index === (variantImageIndex.imageIndex ?? 0)?'eager':undefined}
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

       
       {fullScreenOn && <FullScreenZoomableImage
       
          imageIndex={imageIndex}
         
          changeImageIndex={handleChangeImage}
            
         
          setFullScreenOn={setFullScreenOn}
          images={images}
        />
       }
      
     
    </>
  );
}
