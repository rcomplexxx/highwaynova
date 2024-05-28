import React, { useEffect, useRef, useState } from "react";
import styles from "./ratinginfo.module.css";
import { STARPATH, Star, Stars } from "@/public/images/svgs/svgImages";

export default function RatingInfo({ratingData, openRatingInfo, setOpenRatingInfo}) {  
  
  const ratingInfoWrapperRef = useRef();
  const pointerEventTimeoutRef = useRef();
  
 
   
  useEffect(()=>{

  
    const handleClick= (event)=>{
    
  
      if (!ratingInfoWrapperRef.current.contains(event.target) && window.innerWidth>480)
      setOpenRatingInfo(false);
    }


   if(openRatingInfo) {

    pointerEventTimeoutRef.current= setTimeout(()=>{
  
      ratingInfoWrapperRef.current.style.pointerEvents='auto'
    },300)
   
      ratingInfoWrapperRef.current.classList.add(styles.ratingInfoOpenManualClass);
    ratingInfoWrapperRef.current.style.maxHeight = `${ratingInfoWrapperRef.current.scrollHeight}px`;
      document.addEventListener("click", handleClick)
   

   }
   else{
    clearTimeout(pointerEventTimeoutRef.current);
    ratingInfoWrapperRef.current.style.pointerEvents='none'
      ratingInfoWrapperRef.current.classList.remove(styles.ratingInfoOpenManualClass);
      ratingInfoWrapperRef.current.style.maxHeight = `0`;


      document.removeEventListener("click", handleClick)



   }

   return ()=>{ 
    clearTimeout(pointerEventTimeoutRef.current);
    document.removeEventListener("click", handleClick)
  
  }
  

}, [openRatingInfo])



  return (
    <div ref={ratingInfoWrapperRef} className={`${styles.ratingInfoWrapper} ${openRatingInfo && styles.ratingInfoOpen}`} 
   
    onClick={(event)=>{if(openRatingInfo)event.preventDefault();}}
   >

    <div className={styles.ratingInfoMain}>
  
        <div className={styles.ratingTitle}>
          

      <Star color={`var(--star-color)`} size={32} gap ={4}/>


          <span className={styles.ratingSpan}>{ratingData.rating.toFixed(1)}</span>
          </div>
          {
            [5,4,3,2,1].map((starNumber)=>{

              const sumOfAllReviews = ratingData.reviewsNumber;
              const rateNumber = ratingData[`stars${starNumber}`];
              const percentage= !openRatingInfo?0:rateNumber / sumOfAllReviews *100<1 && rateNumber !=0?1:rateNumber%1>0.4?Math.ceil(rateNumber / sumOfAllReviews *100):Math.floor(rateNumber / sumOfAllReviews *100);

             return <RatingMetric key={starNumber} percentage={percentage} rating={starNumber} rateNumber = {rateNumber}/>
            })

          }
       
          </div>
    </div>
  );
}


function RatingMetric({percentage ,rating, rateNumber}) {  

    

    
  

return <div className={styles.ratingMetric}>
    
           <Stars ratingNumber={rating} starClassName={styles.starClassName}/>



          <div className={styles.percentRatingWrapper}>
            <div className={styles.percentageRatingDiv} style={{width:`${percentage}%`}} ></div>
          </div>
          <span className={styles.rateNumber}>({rateNumber})</span>
</div>
}
