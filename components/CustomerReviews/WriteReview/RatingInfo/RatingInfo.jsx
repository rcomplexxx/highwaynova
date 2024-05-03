import React, { useEffect, useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import styles from "./ratinginfo.module.css";
import { STARPATH } from "@/data/constants";

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
               <StarRatings
            rating={ratingData.rating}

            svgIconPath={STARPATH}

            starRatedColor="var(--star-color)"
            numberOfStars={1}
            starEmptyColor={"var(--star-empty-color)"}
          
            starDimension="32px"
            starSpacing="2px"
          />
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
    <StarRatings
            rating={rating}
            starRatedColor="var(--star-color)"
            numberOfStars={5}
            starEmptyColor={"var(--star-empty-color)"}

            svgIconPath={STARPATH}
            
            starDimension="16px"
            starSpacing="2px"
          />
          <div className={styles.percentRatingWrapper}>
            <div className={styles.percentageRatingDiv} style={{width:`${percentage}%`}} ></div>
          </div>
          <span className={styles.rateNumber}>({rateNumber})</span>
</div>
}
