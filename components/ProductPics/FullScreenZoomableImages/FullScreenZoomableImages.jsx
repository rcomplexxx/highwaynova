import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./fullscreenzoomableimage.module.css";
import { Zoom } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/zoom";

import Image from "next/image";
import ToastMessage from "./ToastMessage/ToastMessage";





const FullScreenZoomableImage = ({
  imageIndex,
  changeImageIndex,
  fullScreenChange,
  images,
}) => {
  const [navActive, setNavActive] = useState(false);


  

  const [showToastMessage, setShowToastMessage] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const [swiper, setSwiper] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
 
 const zoomScaleRef= useRef(1);
 const mouseStartingPointRef=useRef({x:0, y:0})


  const fixedZoomDivRef= useRef();
  const fullImageRef= useRef();




  useLayoutEffect(()=>{


    const mainImg = document.getElementById(`mainImage${imageIndex}`);

    
    

    const fullImg = fullImageRef.current;


    const biggerWidth =
    (window.innerHeight - 48) / window.innerWidth >
    fullImg.naturalHeight / fullImg.naturalWidth;
  const scaleRatio = biggerWidth
    ? (window.innerWidth - 40) / window.innerWidth
    : mainImg.getBoundingClientRect().height / (window.innerHeight - 48);

  // fixedZoomDiv.style.opacity = `0`;




  //prebaciti u complete



 



  const deltaX = biggerWidth
    ? 0
    : mainImg.getBoundingClientRect().left -
      (window.innerWidth -
        ((window.innerHeight - 48) / fullImg.naturalHeight) *
          fullImg.naturalWidth *
          scaleRatio) /
        2;
  const deltaY = biggerWidth
    ? mainImg.getBoundingClientRect().top -
      48 -
      ((window.innerHeight -
        48 -
        (window.innerWidth / fullImg.naturalWidth) * fullImg.naturalHeight) /
        2) *
        scaleRatio
    : mainImg.getBoundingClientRect().top - 48;


    fullImg.style.opacity= 0;
  fullImg.style.transition = "transform 0s ease";
  fullImg.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) scale(${scaleRatio})`;


 
 
     
       

  },[])
 



  useEffect(() => {


   
     
     



  



    if(imageLoaded && fixedZoomDivRef.current){


      const mainImg = document.getElementById(`mainImage${imageIndex}`);

      const fullImg = fullImageRef.current;


      const fixedZoomDiv = fixedZoomDivRef.current;

      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
     
    
      const rgbValues = `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(bgColor.slice(3, 5), 16)}, ${parseInt(bgColor.slice(5, 7), 16)}, 1)`;
    
    
    
      
      fixedZoomDiv.style.backgroundColor = rgbValues;

      setTimeout(()=>{fixedZoomDiv.style.transition = "none";},1)
      

       fullImg.style.opacity='1';

      setNavActive(true);

      mainImg.style.opacity = "0";

      setTimeout(()=>{
        mainImg.style.opacity = "1";
      },210)

    
      fullImg.style.transition = "left 0.3s ease, top 0.3s ease, transform 0.3s ease";
      
      fullImg.style.left = `0`;
      fullImg.style.top = `0`;
      fullImg.style.transform = `scale(1)`;



      if(!matchMedia("(pointer:fine)").matches){



        setTimeout(()=>{
          if(!global.toastMessageNotShowable){
          setShowToastMessage(1);
         
        }
    
    
        }, 380);
    
    
        
    
    
      }
    
      else{
        global.toastMessageNotShowable=true;
      }
    
    
        setTimeout(() => {
          document.documentElement.classList.add("hideScroll");
          
        }, 280);
    
      
    
    


     
  
  }





   


  }, [imageLoaded, fixedZoomDivRef.current]);



  useEffect(()=>{
    const handlePopState=(event)=>{  event.preventDefault();  setNavActive(false);killFullScreen();}

    window?.addEventListener("popstate", handlePopState);

   return ()=>{
    window?.removeEventListener("popstate", handlePopState);
   }
  },[imageIndex,zoomed])

  useEffect(() => {
    const fixedZoomDiv = fixedZoomDivRef.current;
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
   
    const baseRgb=`${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(bgColor.slice(3, 5), 16)}, ${parseInt(bgColor.slice(5, 7), 16)},`
    const getRgbValues = (opacity) =>{ return `rgba(${baseRgb} ${opacity})`};


    let timeoutId;
    let swipeYLock = false;
    let startingTouchCoordinates = { x: 0, y: 0 };
    const imgDiv = document.getElementById("zoomDiv" + imageIndex);

    let currX = 0;
    let currY = 0;

    let multiTouchDetected=false;


    const handleUserInteraction = () => {
      setNavActive(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        setNavActive(false);
      }, 3000);
    };

    const handleTouchStart = (event) => {
      if (event.touches.length > 1) {
        return;
      }

     

      imgDiv.style.transition = "transform 0s ease";

      startingTouchCoordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const handleTouchYMove = (event) => {
      if (swipeYLock || zoomed || multiTouchDetected || event.touches.length > 1) return;
   
      
      console.log('new touch start')
      currY =
        event.changedTouches[event.changedTouches.length - 1].clientY -
        startingTouchCoordinates.y;
      if (currY > -16 && currY < 16) {
        imgDiv.style.transform = `translateY(${0}px)`;
        fixedZoomDiv.style.backgroundColor = getRgbValues(1);

        currX =
          event.changedTouches[event.changedTouches.length - 1].clientX -
          startingTouchCoordinates.x;
        if (currX < -5 || currX > 5) swipeYLock = true;

       
      }

      else{
        //Pomeri sliku na dole, i smanji opacity pozadine
      imgDiv.style.transform = `translateY(${currY}px)`;

      fixedZoomDiv.style.backgroundColor = getRgbValues( 1 -
        Math.abs(
          (imgDiv.getBoundingClientRect().top - 48) / window.innerHeight
        ) *
          2) ;
    }
    };

    const handleTouchEnd = (event) => {
      
      if(zoomed){
        fixedZoomDiv.style.backgroundColor = getRgbValues(1);
        return;
      }
      if (event.touches.length > 0) {
        multiTouchDetected=true;
        imgDiv.style.transform = `translateY(${0}px)`;
fixedZoomDiv.style.backgroundColor = getRgbValues(1);
        return;
      }
      multiTouchDetected=false;
      swipeYLock = false;

        const lastTouch = event.changedTouches[0];
        if (currY < -128 || currY > 128) {
        
          killFullScreen(currY);
        } else {
          if (currY > 16 || currY < -16) {//
          
            if (!zoomed) {
              imgDiv.style.transition =
                "transform 0.3s ease, background-color 0.3s ease";
              imgDiv.style.transform = `translateY(${0}px)`;

              fixedZoomDiv.style.backgroundColor = getRgbValues(1);
            }
          }
        }

        if (
          Math.abs(lastTouch.clientX - startingTouchCoordinates.x) < 16 &&
          Math.abs(lastTouch.clientY - startingTouchCoordinates.y) < 16 &&
          event.target !== document.querySelector(`.${styles.zoomButton}`) &&
          event.target !== document.querySelector(`.${styles.close_button}`)
        )
        
          
          

          timeoutId = setTimeout(() =>{
                
            setNavActive((navActive) => !navActive);
            clearTimeout(timeoutId);
            timeoutId = null;
          }, 300);

          
      
    };
   

    if (matchMedia("(pointer:fine)").matches) {
      handleUserInteraction();
      window.addEventListener("mousemove", handleUserInteraction);
    }
    else{
    window.addEventListener("touchstart", handleTouchStart, true);
    window.addEventListener("touchmove", handleTouchYMove, true);

    window.addEventListener("touchend", handleTouchEnd);
    }
 

    return () => {
      clearTimeout(timeoutId);
      timeoutId = null;
      
        window.removeEventListener("mousemove", handleUserInteraction,true );
   
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchYMove, true);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [imageIndex,zoomed, fixedZoomDivRef.current]);






  

  const killFullScreen = useCallback((currY = 0) => {
  
    if (zoomed) swiper.zoom.toggle();

    
    if( !global.toastMessageNotShowable ){
    if(currY!=0){
     
      setShowToastMessage(2);
    }
    else
    setShowToastMessage(3);

    }



    setTimeout(
      function () {
        const fullImg = fullImageRef.current;
        if(!fullImg)return;
        const mainImg = document.getElementById(`mainImage${imageIndex}`);
        const biggerWidth =
          (window.innerHeight - 48) / window.innerWidth >
          fullImg.naturalHeight / fullImg.naturalWidth;

       







          
        const scaleRatio = biggerWidth
          ? mainImg.getBoundingClientRect().width / fullImageRef.current.getBoundingClientRect().width

          : mainImg.getBoundingClientRect().height / fullImageRef.current.getBoundingClientRect().height;

       

     

        const distanceXDifference =
          mainImg.getBoundingClientRect().left -
          fullImg.getBoundingClientRect().left;

            


        const XTr = biggerWidth
          ? distanceXDifference -
            (fullImg.getBoundingClientRect().width -
              fullImg.getBoundingClientRect().width * scaleRatio) /
              2
          : mainImg.getBoundingClientRect().left -
            (window.innerWidth -
              (fullImg.getBoundingClientRect().height / fullImg.naturalHeight) *
                fullImg.naturalWidth *
                scaleRatio) /
              2;



               const distanceYDifference =
          mainImg.getBoundingClientRect().top -
          fullImg.getBoundingClientRect().top;

          //48 + (window.innerHeight - 48 - (window.innerWidth * fullImg.naturalHeight / fullImg.naturalWidth))/2 Formula za izracunavanje mainImg topa minus fullImg Top
        const YTr = biggerWidth
          ? 
          
          mainImg.getBoundingClientRect().top -
            48 -
            ((window.innerHeight -
              48 -
              (window.innerWidth * fullImg.naturalHeight) /
                fullImg.naturalWidth) /
              2) *
              scaleRatio -
            currY
          : distanceYDifference;



       
      
      

        fullImg.style.transform = `translateX(${XTr}px) translateY(${YTr}px) scale(${scaleRatio})`;

        fixedZoomDivRef.current.style.transition = "background-color 0.2s 0.01s ease";
        fixedZoomDivRef.current.style.backgroundColor = `rgba(0, 0, 0, 0)`;

       
       
              setNavActive(false);
        

        setTimeout(function () {
          fullScreenChange(false);
          document.documentElement.classList.remove("hideScroll");
      
        }, 300);

       
      },
      zoomed ? 300 : 0
    );
  },[zoomed, imageIndex, fixedZoomDivRef.current]);


 


  return (
  
      <div ref={fixedZoomDivRef} className={`${styles.full_screen_container}`}>
 

      
          <div
            className={`${styles.closeSuiter} ${
              navActive && styles.navActive
            }`}
          >
            <div className={styles.pagination}>
              {imageIndex + 1} / {swiper && swiper.slides?.length}
            </div>
            <div>
              <Image
                height={0}
                width={0}
                sizes="24px"
                src={
                  zoomed //zoomedChange
                    ? "/images/zoomOutIconAw.png"
                    : "/images/zoomIconAw.png"
                }
                alt="zoom"
                onClick={(event) => {
                  event.stopPropagation();
                  swiper.zoom.toggle();
                }}
                className={styles.zoomButton}
              />
              <Image
                height={0}
                width={0}
                sizes="24px"
                src="/images/cancelDark.png"
                alt="cancel"
                onClick={(event) => {
                  event.stopPropagation();
                  killFullScreen();
                }}
                className={styles.close_button}
              />
            </div>
          </div>

          <Image
            height={12}
            width={12}
            src="/images/greaterLess3.png"
            onClick={() => {
              swiper.slidePrev();
            }}
            className={`${styles.leftArrow} ${navActive && styles.spawnArrow}`} //!arrowDissapear
         / >
          <Image
            height={12}
            width={12}
            src="/images/greaterLess3.png"
            onClick={() => {
              swiper.slideNext();
            }}
            className={`${styles.leftArrow} ${styles.rightArrow} ${navActive && styles.spawnArrow}`}
          />


           <Swiper
            initialSlide={imageIndex}
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
             
              zoomScaleRef.current = scale;
              swiper.allowTouchMove= scale<=1;
        
              
            }}

           
            onSlideChange={(swiper) => {
              if (zoomed) {swiper.zoom.out();
              setZoomed(false);
              }
              changeImageIndex(swiper.activeIndex);
            }}
            onSwiper={setSwiper}
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
                    id={"zoomDiv" + index}
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
                      
                      onMouseUp={(event) => {
                     
                        if (
                          event.button !== 0 ||
                          !matchMedia("(pointer:fine)").matches
                        )
                          return;
                        const { clientX, clientY } = event;
  
                        const differenceX = Math.abs(
                          clientX - mouseStartingPointRef.current.x
                        );
                        const differenceY = Math.abs(
                          clientY - mouseStartingPointRef.current.y
                        );
  
                        if (differenceX < 12 && differenceY < 12) {
                          swiper.zoom.toggle();
                        }
                      }}
                  >
                    <Image
                      id={`fullImage${index}`}
                      ref={index==imageIndex?fullImageRef:undefined}
                      height={0}
                      width={0}
                      sizes="100vw"
                      loading={"eager"}
                      onLoad={()=>{setImageLoaded(true)}}
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
