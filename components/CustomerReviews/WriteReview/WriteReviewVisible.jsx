import Image from 'next/image';
import React, { useEffect,  useState } from 'react'
import RatingInfo from './RatingInfo/RatingInfo';
import styles from './writereviewvisible.module.css';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import SortReviewsButton from './SortReviewsButton/SortReviewsButton';
import { ArrowDown, STARPATH, Stars } from '@/public/images/svgs/svgImages';


const WriteReview = dynamic(() => import('./WriteReview'));


export default function WriteReviewVisible({ratingData, sortingType, setSortingType}) {
    const [openRatingInfo, setOpenRatingInfo]=useState(false);
    const  [infoDivOpen, setInfoDivOpen] = useState(undefined);

    const router = useRouter();

  


    useEffect(() => {

      if(infoDivOpen===undefined){
        if(router.asPath.includes("#write-review"))
        router.push(router.asPath.split('#write-review')[0]);
      
        return;
      }
      
      if (infoDivOpen) {
        if(!router.asPath.includes("#write-review")) router.push(router.asPath + "#write-review");


        
   

      }
  
      else{
  
      if (router.asPath.includes("#write-review")) {
        if(global.stopRouteExecution)global.stopRouteExecution=false;
        else router.back();
      }
    
      }

  
  
    
    }, [infoDivOpen]);


   
  
  
  





   
    useEffect(()=>{

        if(infoDivOpen) { 
          
        //  document.body.classList.add('hideScroll'); 
        document.documentElement.classList.add("hideScroll");
      }
       
     
         else document.documentElement.classList.remove("hideScroll");
        // document.body.classList.remove('hideScroll');

        return ()=>{document.documentElement.classList.remove("hideScroll");}
       
     },[infoDivOpen]);

  return (<>
    <div className={styles.writeReviewDiv}>
        <div className={styles.ratingDiv}
        onClick={(event)=>{
          event.stopPropagation();
          event.preventDefault();
          
         setOpenRatingInfo(!openRatingInfo)}}>
         
          <Stars ratingNumber={ratingData.rating} size={24} gap={4}/>
          
          <span className={styles.reviewsNumberSpan}>
            {ratingData.reviewsNumber} reviews
          </span>

          <ArrowDown color={'var(--rating-arrow-color)'} styleClassName={`${styles.plusStyle} ${
            openRatingInfo && styles.plusStyleRotate
          }`}/>
        

        </div>
       <RatingInfo ratingData={ratingData} openRatingInfo={openRatingInfo} setOpenRatingInfo={setOpenRatingInfo}/>




        <button
          onClick={() => {
            setInfoDivOpen(!infoDivOpen);
          }}
          className={styles.writeReviewButton}
        >
          Write review
        </button>
        <SortReviewsButton sortingType={sortingType} setSortingType={setSortingType}/>
      </div>
          {infoDivOpen &&  <WriteReview infoDivOpen={infoDivOpen} setInfoDivOpen={setInfoDivOpen}/>}
      </>
  )
}
