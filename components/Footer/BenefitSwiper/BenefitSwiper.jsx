import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import "swiper/css";
import 'swiper/css/autoplay';

import styles from './benefitswiper.module.css'
import Image from 'next/image';

export default function BenefitSwiper() {
    


    const [swiper, setSwiper] = useState(null);
 
    const swiperAutoPlayStopTimoutRef= useRef();



    const pauseSwiperAutoPlay = () =>{
        swiper.autoplay.stop(); // Stop autoplay immediately
             clearTimeout(swiperAutoPlayStopTimoutRef.current);
           swiperAutoPlayStopTimoutRef.current=setTimeout(() => {
             swiper.autoplay.start(); // Restart autoplay after 5 seconds
           }, 2000);
      }

      /*~!!!Prebaciti png slike strelica u ArrowDown kad koristim ovu komponentu!!!~ */


  return (
    <div className={styles.benefitDivWrapper}>
      





    <Swiper onSwiper={setSwiper}  speed={400} slidesPerView='auto'   loop  autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
     modules={[Autoplay]} onTransitionStart={()=>{swiper.autoplay.stop();}} onTransitionEnd={()=>{ pauseSwiperAutoPlay();}}
    >

    <SwiperSlide key={0} className={`carousel-item ${styles.benefitSlide}`}
   >
      <div className={styles.benefitSlideInsideWrapper}> 
     <div className={styles.benefitDiv}>
     <Image onClick={()=>{swiper.slidePrev();   pauseSwiperAutoPlay();}} className={styles.arrowLeft} src='/images/greaterLess3.png' width={0} height={0}/>

      <div className={styles.internalBenefitDiv}>
  <Image className={styles.benefitImg} src='/images/truckIcon8.svg' width={0} height={0}/>
  <span className={styles.benefitText} src='/images/greaterLess3.png'>Free shipping</span>
  </div>

  <Image onClick={()=>{swiper.slideNext();    pauseSwiperAutoPlay();}} 
  className={`${styles.arrowLeft} ${styles.arrowRight}`} src='/images/greaterLess3.png' width={0} height={0}/>

  </div>
  </div>
    </SwiperSlide>
    <SwiperSlide key={1} className={`carousel-item`}
   >
     <div className={styles.benefitSlideInsideWrapper}> 
     <div className={styles.benefitDiv}>
     
     <Image onClick={()=>{swiper.slidePrev();   pauseSwiperAutoPlay();}} className={styles.arrowLeft} src='/images/greaterLess3.png' width={0} height={0}/>


     <div className={styles.internalBenefitDiv}>
  <Image className={styles.benefitImg} src='/images/shippingReturnIcon2.png' width={0} height={0}/>
  <span className={styles.benefitText} src='/images/greaterLess3.png'>Free returns</span>
  </div>


  <Image onClick={()=>{swiper.slideNext();    pauseSwiperAutoPlay();}} 
  className={`${styles.arrowLeft} ${styles.arrowRight}`} src='/images/greaterLess3.png' width={0} height={0}/>
</div>

  </div>
     
    </SwiperSlide>
    <SwiperSlide key={2} className={`carousel-item`}
   >
    <div className={styles.benefitSlideInsideWrapper}> 
     <div className={styles.benefitDiv}>


     <Image onClick={()=>{swiper.slidePrev();   pauseSwiperAutoPlay();}} className={styles.arrowLeft} src='/images/greaterLess3.png' width={0} height={0}/>

     <div className={styles.internalBenefitDiv}>
  <Image className={styles.benefitImg} src='/images/guarantee3.png' width={0} height={0}/>
  <span className={styles.benefitText} src='/images/greaterLess3.png'>30-days Money back guarantee</span>
  </div>
  <Image onClick={()=>{swiper.slideNext();    pauseSwiperAutoPlay();}} 
  className={`${styles.arrowLeft} ${styles.arrowRight}`} src='/images/greaterLess3.png' width={0} height={0}/>
</div>
  
  </div>
  
     
    </SwiperSlide>
  
</Swiper>





   













    </div>
  )
}
