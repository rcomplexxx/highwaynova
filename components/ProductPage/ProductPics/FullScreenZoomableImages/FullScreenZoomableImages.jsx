import { useCallback,  useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./fullscreenzoomableimage.module.css";
import { Zoom } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";

import Image from "next/image";
import ToastMessage from "./ToastMessage/ToastMessage";
import { ArrowDown, CancelIcon, ZoomInIcon, ZoomOutIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";

import { transformColorToRgb } from "@/utils/utils-client/transformColorToRgba";
import { useRouter } from "next/router";





const FullScreenZoomableImage = ({
  imageIndex,
  changeImageIndex,
  setFullScreenOn,
  images,
  mainImageRef
}) => {
  const [navActive, setNavActive] = useState(false);


  

  const [showToastMessage, setShowToastMessage] = useState(0);


  
  

  const [zoomed, setZoomed] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [closingFullscreen, setClosingFullscreen] = useState(false);
 
  
 const mouseStartingPointRef=useRef({x:0, y:0})


  const swiperRef = useRef();
 
 
  const initialIndexRef = useRef(imageIndex)
  const fixedZoomDivRef= useRef();
  const fullImageRef= useRef();

  const zoomDivRef = useRef();

  const finalYDistance = useRef();

  

  const { increaseDeepLink, decreaseDeepLink } = useGlobalStore((state) => ({
    increaseDeepLink: state.increaseDeepLink,
    decreaseDeepLink: state.decreaseDeepLink,
  }));



  const router = useRouter();
  


  useLayoutEffect(() => {
    const mainImg = mainImageRef.current;
    const fullImg = fullImageRef.current;
  
    const isBiggerWidth =
      (window.innerHeight - 48) / window.innerWidth >
      fullImg.naturalHeight / fullImg.naturalWidth;
  
    const scaleRatio = isBiggerWidth
      ? (window.innerWidth - 48) / window.innerWidth
      : mainImg.getBoundingClientRect().height / (window.innerHeight - 48);
  
    const deltaX = isBiggerWidth
      ? 0
      : mainImg.getBoundingClientRect().left -
        (window.innerWidth -
          ((window.innerHeight - 48) / fullImg.naturalHeight) *
            fullImg.naturalWidth *
            scaleRatio) / 2;
  
    const deltaY = isBiggerWidth
      ? mainImg.getBoundingClientRect().top - 48 -
        ((window.innerHeight - 48 -
          (window.innerWidth / fullImg.naturalWidth) * fullImg.naturalHeight) /
          2) * scaleRatio
      : mainImg.getBoundingClientRect().top - 48;
  
    fullImg.style.opacity = 0;
    fullImg.style.transition = "transform 0s ease";
    fullImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleRatio})`;
    fullImg.style.transition = "transform 0.3s ease";
  

    
    return ()=>{
      document.documentElement.classList.remove("hideScroll");
    }
  }, []);
 



  useLayoutEffect(() => {
    if (!imageLoaded) return;
  
    const mainImg = mainImageRef.current;
    const fullImg = fullImageRef.current;
    const fixedZoomDiv = fixedZoomDivRef.current;
  
    const rgbValues = transformColorToRgb(
      getComputedStyle(document.documentElement).getPropertyValue('--bg-color')
    );
    fixedZoomDiv.style.backgroundColor = rgbValues;
    setTimeout(() => { fixedZoomDiv.style.transition = "none"; }, 1);
  
    fullImg.style.opacity = '1';
    fullImg.style.transition = "left 0.3s ease, top 0.3s ease, transform 0.3s ease";
    fullImg.style.left = '0';
    fullImg.style.top = '0';
    fullImg.style.transform = 'scale(1)';
  
    setNavActive(true);
    mainImg.style.opacity = '0';
    setTimeout(() => { mainImg.style.opacity = '1'; }, 210);
  
    if (!matchMedia("(pointer:fine)").matches) {
      setTimeout(() => {
        if (!global.toastMessageNotShowable) setShowToastMessage(1);
      }, 380);
    } else {
      global.toastMessageNotShowable = true;
    }
  
    setTimeout(() => {
      document.documentElement.classList.add("hideScroll");
    }, 280);
  
  }, [imageLoaded]);





  useEffect(() => {
    const handlePopState = () => {

      if(global.deepLinkLastSource !== 'zoom') return;
      
      window.removeEventListener("popstate", handlePopState);
     
      
      killFullScreen();
    };
    
   
    
    increaseDeepLink('productZoom', 'zoom');
    
    window.addEventListener("popstate", handlePopState);
    return () => {
    
      
      window.removeEventListener("popstate", handlePopState);
      decreaseDeepLink();
    }
  }, []);

  



  useEffect(() => {
    const fixedZoomDiv = fixedZoomDivRef.current;
  const imgDiv = zoomDivRef.current;
  const getRgbValues = (opacity) => transformColorToRgb(
    getComputedStyle(document.documentElement).getPropertyValue('--bg-color'), opacity
  );

  let timeoutId, swipeYLock = false, multiTouchDetected = false;
  let startingTouchCoordinates = { x: 0, y: 0 }, currX = 0, currY = 0;

  const handleUserInteraction = () => {
    setNavActive(true);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setNavActive(false), 3000);
  };

  const handleTouchStart = ({ touches }) => {
    if(finalYDistance.current || finalYDistance.current===0)return;
    if (touches.length > 1) return;
    imgDiv.style.transition = "transform 0s ease";
    startingTouchCoordinates = { x: touches[0].clientX, y: touches[0].clientY };
  };





  

    const handleTouchYMove = (event) => {
      if(finalYDistance.current || finalYDistance.current===0)return;
      if(event.touches.length > 1)return;
      else{multiTouchDetected=false;} //detected
      if (swipeYLock || zoomed || multiTouchDetected) return;
   
      
      console.log('new touch start')

      
      currY = event.touches[0].clientY - startingTouchCoordinates.y;


      if (Math.abs(currY) < 16) {
        imgDiv.style.transform = `translateY(0)`;
        fixedZoomDiv.style.backgroundColor = getRgbValues(1);

        currX = event.touches[0].clientX - startingTouchCoordinates.x;
        if (Math.abs(currX) > 5) swipeYLock = true;

       
      }

      else{
        //Pomeri sliku na dole, i smanji opacity pozadine
        imgDiv.style.transform = `translateY(${currY}px)`;
        fixedZoomDiv.style.backgroundColor = getRgbValues(
          1 - (Math.abs(imgDiv.getBoundingClientRect().top - 48) / window.innerHeight) * 2
        );
    }
    };



    const handleTouchEnd = (event) => {

      if(finalYDistance.current || finalYDistance.current===0)return;
      
      if(zoomed){
        fixedZoomDiv.style.backgroundColor = getRgbValues(1);
        return;
      }


      if (event.touches.length > 0) {
        multiTouchDetected=true;
//         imgDiv.style.transform = `translateY(${0}px)`;
// fixedZoomDiv.style.backgroundColor = getRgbValues(1);
        return;
      }
      multiTouchDetected=false;
      swipeYLock = false;

        const lastTouch = event.changedTouches[0];
        if (Math.abs(currY) > 128) {
          finalYDistance.current = currY;
          router.back();
        } else if (Math.abs(currY) > 16) {//
          
            if (!zoomed) {
              imgDiv.style.transition = "transform 0.3s ease, background-color 0.3s ease";
              imgDiv.style.transform = `translateY(${0}px)`;
              fixedZoomDiv.style.backgroundColor = getRgbValues(1);
            }
          }
        

        if (
          Math.abs(lastTouch.clientX - startingTouchCoordinates.x) < 16 &&
          Math.abs(lastTouch.clientY - startingTouchCoordinates.y) < 16 &&
          !event.target.matches(`.${styles.zoomButton}, .${styles.close_button}`)
        )
        
          
        {
          timeoutId = setTimeout(() => {
            setNavActive((navActive) => !navActive);
            clearTimeout(timeoutId);
            timeoutId = null;
          }, 300);
        }

          
      
    };
   

    if (matchMedia("(pointer:fine)").matches) {
      handleUserInteraction();
      window.addEventListener("mousemove", handleUserInteraction);
  } else {
      window.addEventListener("touchstart", handleTouchStart, true);
      window.addEventListener("touchmove", handleTouchYMove, true);
      window.addEventListener("touchend", handleTouchEnd);
  }
  
  return () => {
      clearTimeout(timeoutId);
      timeoutId = null;
  
      window.removeEventListener("mousemove", handleUserInteraction, true);
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchYMove, true);
      window.removeEventListener("touchend", handleTouchEnd);
  };
  }, [zoomed,swiperRef.current?.activeIndex]);






  

  const killFullScreen = useCallback(() => {


  
   
    if (zoomed) swiperRef.current.zoom.toggle();

    setClosingFullscreen(true);

    
    if (!global.toastMessageNotShowable) {
      setShowToastMessage((finalYDistance.current && finalYDistance.current !== 0) ? 2 : 3);
  }



    setTimeout(
      function () {


        const fullImg = fullImageRef.current;
        if(!fullImg)return;


        
        setNavActive(false);

        const mainImg = mainImageRef.current;

        const fullImgRect = fullImg.getBoundingClientRect();
        const mainImgRect = mainImg.getBoundingClientRect();


          
        const isBiggerWidth = (window.innerHeight - 48) / window.innerWidth > fullImg.naturalHeight / fullImg.naturalWidth;

       







          
        const scaleRatio = isBiggerWidth
            ? mainImgRect.width / fullImgRect.width
            : mainImgRect.height / fullImgRect.height;


       

     
            const distanceX = mainImgRect.left - fullImgRect.left;
            const distanceY = mainImgRect.top - fullImgRect.top;


            const XTr = isBiggerWidth
            ? distanceX - (fullImgRect.width * (1 - scaleRatio)) / 2
            : mainImgRect.left - (window.innerWidth - (fullImgRect.height / fullImg.naturalHeight) * fullImg.naturalWidth * scaleRatio) / 2;


            const YTr = isBiggerWidth
            ? mainImgRect.top - 48 - ((window.innerHeight - 48 - (window.innerWidth * fullImg.naturalHeight) / fullImg.naturalWidth) / 2) * scaleRatio - (finalYDistance.current || 0) 
            : distanceY;

           
                    
    
                    



       
      
      

                    fullImg.style.transform = `translateX(${XTr}px) translateY(${YTr}px) scale(${scaleRatio})`;
                    fixedZoomDivRef.current.style.transition = "background-color 0.2s 0.01s ease";
                    fixedZoomDivRef.current.style.backgroundColor = "rgba(0, 0, 0, 0)";

       
       
        

        setTimeout(function () {
          setFullScreenOn(false);
        
      
        }, 300);

       
      },
      zoomed ? 300 : 0
    );
  },[zoomed,swiperRef.current?.activeIndex]);


 


  return (
  
      <div ref={fixedZoomDivRef} className={`${styles.full_screen_container}`}>
 

      
          <div
            className={`${styles.closeSuiter} ${
              !closingFullscreen && navActive && styles.navActive
            }`}
          >
            <div className={styles.pagination}>
              {imageIndex + 1} / {swiperRef.current?.slides?.length}
            </div>

            <div>
           {zoomed?<ZoomOutIcon
               handleClick={(event) => {
                event.stopPropagation();
                swiperRef.current.zoom.toggle();
              }}

              styleClassName={styles.zoomButton}
              />:<ZoomInIcon
              handleClick={(event) => {
               event.stopPropagation();
               swiperRef.current.zoom.toggle();
             }}

             styleClassName={styles.zoomButton}
             />

            }

              <CancelIcon color={`var(--fullscreen-cancel-image-color)`} styleClassName={styles.close_button} handleClick={(event) => {
                  event.stopPropagation();
                  router.back();
                }}/>
              
            </div>
          </div>

          

          <ArrowDown color={'var(--fullscreen-arrow-color)'}
          handleClick={() => {
            swiperRef.current.slidePrev();
            }} styleClassName={`${styles.leftArrow} ${navActive && styles.spawnArrow}`}/>

<ArrowDown color={'var(--fullscreen-arrow-color)'}
          handleClick={() => {
            swiperRef.current.slideNext();
            }} styleClassName={`${styles.leftArrow} ${styles.rightArrow} ${navActive && styles.spawnArrow}`}/>

        

           <Swiper
            initialSlide={initialIndexRef.current}
            speed={400}
            slidesPerView={1}
            preventClicks={false}
        preventClicksPropagation={false}
        touchStartPreventDefault={false}
        touchAngle={35}
            zoom={{
              enabled: true,
              minRatio: 1,
              maxRatio: 2,
              toggle: !matchMedia("(pointer:fine)").matches,
            }}
            onZoomChange={(swiper, scale) => {
              setZoomed(scale>1);
             
             
              swiper.allowTouchMove= scale<=1;
        
              
            }}

           
            onSlideChange={(swiper) => {
              zoomed && (swiper.zoom.out(), setZoomed(false));
              changeImageIndex(swiper.activeIndex, true);
            }}
            onSwiper={(swiperInstance)=>{swiperRef.current = swiperInstance}}
            modules={[Zoom]}
            className={styles.productImageSwiper}
            grabCursor={true}
          >
            {images.map((image, index) => (
              <SwiperSlide
               
                key={index}
                className="carousel-item"
                zoom={true}
              >
                
                  <div
                    ref={index===imageIndex?zoomDivRef:undefined}
                    className={`${styles.productImageDiv} ${
                      zoomed && styles.productImageDivZoomed //zoomedChange
                    } swiper-zoom-target`}
                    onMouseDown={(event) => {
                 
                        
                        if (
                          event.button !== 0 ||
                          !matchMedia("(pointer:fine)").matches
                        )
                          return;
                      
                          mouseStartingPointRef.current={ x: event.clientX, y: event.clientY }
                      
                      }}
                      
                      onMouseUp={({ button, clientX, clientY }) => {
                        if (button !== 0 || !matchMedia("(pointer:fine)").matches) return;
                      
                        const { x: startX, y: startY } = mouseStartingPointRef.current;
                        if (Math.abs(clientX - startX) < 12 && Math.abs(clientY - startY) < 12) {
                          swiperRef.current.zoom.toggle();
                        }
                      }}
                  >
                    <Image
                      id={`fullImage${index}`}
                      ref={index===imageIndex?fullImageRef:undefined}
                      height={0}
                      width={0}
                      sizes="100vw"
                      priority={index===initialIndexRef.current}
                      loading={index===initialIndexRef.current?"eager":undefined}
                      onLoad={()=>{if(index===initialIndexRef.current)setImageLoaded(true);}}
                      src={image.src}
                      alt="Zoomable"
                      className={`${styles.productImage}`}
                      draggable={false}
                    />
                  </div>
             
              </SwiperSlide>
            ))}
          </Swiper>

        
        { showToastMessage!=0 && <ToastMessage showToastMessage={showToastMessage} setShowToastMessage={setShowToastMessage}/>}
      </div>
  
  );
};

export default FullScreenZoomableImage;
