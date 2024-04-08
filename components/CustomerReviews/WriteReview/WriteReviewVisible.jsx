import Image from 'next/image';
import React, { useEffect,  useState } from 'react'
import StarRatings from 'react-star-ratings';
import RatingInfo from './RatingInfo/RatingInfo';
import styles from './writereviewvisible.module.css';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';


const WriteReview = dynamic(() => import('./WriteReview'));


export default function WriteReviewVisible({ratingData}) {
    const [openRatingInfo, setOpenRatingInfo]=useState(false);
    const  [infoDivOpen, setInfoDivOpen] = useState(undefined);

    const router = useRouter();

  

    useEffect(()=>{
      router.beforePopState((state) => {
        
        state.options.scroll = false;
          
        return true;
     
      });
    })


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

      router.beforePopState((state) => {
       
        state.options.scroll = false;
        return true;
      });
  
    
    }, [infoDivOpen]);


   
  
  
  





   
    useEffect(()=>{

        if(infoDivOpen) { 
          
        //  document.body.classList.add('hideScroll'); 
        document.documentElement.classList.remove("hideScroll");
      }
       
     
         else document.documentElement.classList.remove("hideScroll");
        // document.body.classList.remove('hideScroll');
       
     },[infoDivOpen]);

  return (<>
    <div className={styles.writeReviewDiv}>
        <div className={styles.ratingDiv}
        onClick={(event)=>{
          event.stopPropagation();
          event.preventDefault();
          
         setOpenRatingInfo(!openRatingInfo)}}>
          <StarRatings
            rating={ratingData.rating}
            starRatedColor="var(--star-color)"
            numberOfStars={5}
            starEmptyColor={"var(--star-empty-color)"}
           
            starDimension="24px"
            starSpacing="2px"
          />
          <span className={styles.reviewsNumberSpan}>
            {ratingData.reviewsNumber} reviews
          </span>

          <Image
        src={'/images/greaterLess3Dark.png'}
        loading={'lazy'} alt='Show'
        height={0}
        width={0}
        sizes="12px"
          className={`${styles.plusStyle} ${
            openRatingInfo && styles.plusStyleRotate
          }`}
        />

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
      </div>
          {infoDivOpen &&  <WriteReview infoDivOpen={infoDivOpen} setInfoDivOpen={setInfoDivOpen}/>}
      </>
  )
}
