import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import styles from "./customerreviews.module.css";
import ReactHtmlParser from "react-html-parser";

import WriteReviewVisible from "./WriteReview/WriteReviewVisible";
import FullScreenReview from "./FullScreenReview/FullScreenReview";
import { CustomerStars, Spinner} from "@/public/images/svgs/svgImages";



export default function CustomerReviews({ product_id, ratingData, startReviews }) {


 
  const [reviews, setReviews] = useState(startReviews || []);
  
  const [loadButtonExists, setLoadButtonExists] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sortingType, setSortingType] = useState("featured");

  const [shrinkReview, setShrinkReview] = useState(false)

  const [fullScreenReview, setFullScreenReview] = useState();

  const newReviewsRef = useRef(startReviews || []);

  




  useLayoutEffect(()=>{
    
    


    setSortingType("featured")

      setReviews(startReviews);

    

      newReviewsRef.current = startReviews; // Load 6 more reviews
      
 
      setLoadButtonExists(true);
  


  },[product_id, startReviews])




  const handleSortingTypeChange = async (newSortingType) => {
    setShrinkReview(true);
  
    const fetchReviews = async () => {
      const response = await fetch("/api/getreviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id,
          starting_position: 0,
          limit: 20,
          sortingType: newSortingType
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        newReviewsRef.current = data.reviews;
        setReviews(data.reviews);
        setLoadButtonExists(true);
      } else {
        console.error('Response error:', response);
      }
    };
  
    setTimeout(async () => {
      setSortingType(newSortingType);
      await fetchReviews();
      setTimeout(() => setShrinkReview(false), 200);
    }, 500);
  };


  



 const handleShowMore = useCallback(async () => {
  if (isLoading) return; // Prevent multiple clicks

  setIsLoading(true);
  console.log('Review info before', newReviewsRef.current, ' | ', reviews);

  try {
    const currentReviewLength = reviews.length;
    const index = currentReviewLength - 1;

    // If we can load more from existing reviews
    if (currentReviewLength < newReviewsRef.current.length - 8) {
      setReviews((prev) => [
        ...prev,
        ...(newReviewsRef.current.slice(index + 1, index + 9)),
      ]);
    } else {
      const response = await fetch("/api/getreviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id,
          starting_position: newReviewsRef.current.length,
          sortingType,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.reviews.length === 0) {
          setLoadButtonExists(false);
          setReviews((prev) => [
            ...prev,
            ...(newReviewsRef.current.slice(index + 1)) // Load all remaining reviews
          ]);
        } else {

          
          newReviewsRef.current = [...newReviewsRef.current, ...data.reviews]; // Keep the remaining reviews
          setReviews((prev) => [
            ...prev,
            ...(newReviewsRef.current.slice(index, index + 8))
          ]);
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  } finally {
    setIsLoading(false); // Reset loading state
  }
}, [isLoading, reviews, sortingType]);














  return (
    <div className={styles.mainDiv} id="customerReviews">
 

      
   <WriteReviewVisible ratingData={ratingData} sortingType={sortingType} setSortingType={handleSortingTypeChange}/>









    


      <div  id='masonry' className={styles.masonry}>
          {reviews.map((review, index) => {
            return (
              <Review
                key={index}
                setFullScreenReview={setFullScreenReview}
                name={review.name}
                text={review.text}
                stars={review.stars}
               
                
               

                reviewImgSrc={review.imageNames && JSON.parse(review.imageNames).length!==0 && 
                  `/images/review_images/productId_${product_id}/${JSON.parse(review.imageNames)[0]}`
                }
                shrinkReview={shrinkReview}
              />
            );
          })}
       </div>
       
      {loadButtonExists && (
        <button
       
          className={styles.showMoreButton}
          onClick={handleShowMore}
        >
          
          {isLoading?<Spinner color={'var(--load-more-reviews-spinner-color)'}/>:"Show more"}
        </button>
      )}
      {fullScreenReview && <FullScreenReview authorName={fullScreenReview.authorName} text={fullScreenReview.text} stars={fullScreenReview.stars} 
      imageSrc={fullScreenReview.imageSrc} setFullScreenReview={setFullScreenReview}/>}
    </div>
  );
}












function Review({  name, text,  stars,  reviewImgSrc, setFullScreenReview, shrinkReview}) {

  




 
  return (
    <div onClick={()=>{setFullScreenReview({authorName:name, text:text, stars:stars, 
    imageSrc:reviewImgSrc
  
  })}} 
    
    className={`${styles.reviewDiv} ${shrinkReview && styles.reviewDivShrinked}`}>
      {reviewImgSrc &&
            <Image
            
              height={0}
              width={0}
              src={reviewImgSrc}
              alt="review image"
            
              
              
              sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={styles.reviewImage}
            />
        }

       
       

        <CustomerStars ratingNumber={parseInt(stars, 10)}/>

        
        
      <p className={styles.reviewText}>{ReactHtmlParser(text)}</p>
      <p className={styles.reviewAuthor}>{name}</p>
    </div>
  );
}