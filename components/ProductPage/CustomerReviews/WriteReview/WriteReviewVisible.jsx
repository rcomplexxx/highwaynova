import Image from 'next/image';
import { useEffect,  useState } from 'react'
import RatingInfo from './RatingInfo/RatingInfo';
import styles from './writereviewvisible.module.css';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import SortReviewsButton from './SortReviewsButton/SortReviewsButton';
import { ArrowDown, Stars } from '@/public/images/svgs/svgImages';


const WriteReview = dynamic(() => import('./WriteReview'));


export default function WriteReviewVisible({ratingData, sortingType, setSortingType}) {



    const [openRatingInfo, setOpenRatingInfo]=useState(false);
    const [writeReviewOpen, setWriteReviewOpen] = useState(undefined);

    const router = useRouter();

  


    useEffect(() => {
      if (writeReviewOpen === undefined && router.asPath.includes("#write-review")) {
        router.replace(router.asPath.replace("#write-review", ""));
      }
    }, [writeReviewOpen]);


   
  
  
  




    


  return (<>
    <div className={styles.writeReviewDiv}>
        <div className={styles.ratingDiv}
        onClick={(event)=>{
          event.stopPropagation();
          event.preventDefault();
          
         setOpenRatingInfo(!openRatingInfo)}}>
         
          <Stars ratingNumber={ratingData.rating} starClassName={styles.starClassName}/>
          
          <span className={styles.reviewsNumberSpan}>
            {ratingData.reviewsNumber} reviews
          </span>

          <ArrowDown color={'var(--rating-show-title-color)'} styleClassName={`${styles.plusStyle} ${
            openRatingInfo && styles.plusStyleRotate
          }`}/>
        

        </div>
       <RatingInfo ratingData={ratingData} openRatingInfo={openRatingInfo} setOpenRatingInfo={setOpenRatingInfo}/>




        <button
          onClick={() => {
            setWriteReviewOpen(!writeReviewOpen);
          }}
          className={styles.writeReviewButton}
        >
          Write review
        </button>
        <SortReviewsButton sortingType={sortingType} setSortingType={setSortingType}/>
      </div>
          {writeReviewOpen &&  <WriteReview writeReviewOpen={writeReviewOpen} setWriteReviewOpen={setWriteReviewOpen}/>}
      </>
  )
}
