import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "./customerreviews.module.css";
import StarRatings from "react-star-ratings";
import parse from "html-react-parser";
import WriteReviewVisible from "./WriteReview/WriteReviewVisible";
import FullScreenReview from "./FullScreenReview/FullScreenReview";
import { STARPATH } from "@/public/images/svgs/svgImages";

function Review({ product_id,  name, text,  stars, imageNames, setFullScreenReview, shrinkReview}) {

    const reviewRef= useRef();




 
  return (
    <div ref={reviewRef}  onClick={()=>{setFullScreenReview({authorName:name, text:text, stars:stars, 
    imageSrc:(imageNames && JSON.parse(imageNames).length!==0) && 
    `/images/review_images/productId_${product_id}/${JSON.parse(imageNames)[0]}`
  
  })}} 
    
    className={`${styles.reviewDiv} ${shrinkReview && styles.reviewDivShrinked}`}>
      {imageNames && JSON.parse(imageNames).length!==0 &&
            <Image
            
              height={0}
              width={0}
              src={`/images/review_images/productId_${product_id}/${JSON.parse(imageNames)[0]}`}
              alt="review image"
              loading={reviewRef.current?undefined:"lazy"}
              priority={reviewRef.current}
              sizes="(max-width: 580px) 100vw, (max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={styles.reviewImage}
            />
        }

        <div className={styles.starDiv}>
        <StarRatings
          rating={parseInt(stars, 10)}
          svgIconPath={STARPATH}
          starRatedColor="var(--star-color)"
          numberOfStars={5}
          starEmptyColor={"var(--star-empty-color)"}
          starDimension="20px"
          starSpacing="2px"
        />
    </div>
      <p className={styles.reviewText}>{parse(text)}</p>
      <p className={styles.reviewAuthor}>{name}</p>
    </div>
  );
}

export default function CustomerReviews({ product_id, ratingData, startReviews }) {


 
  const [reviews, setReviews] = useState(startReviews ? startReviews : []);
  const newReviews = useRef(startReviews ? startReviews : []);
  const [loadButtonExists, setLoadButtonExists] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortingType, setSortingType] = useState("featured");
  const [shrinkReview, setShrinkReview] = useState(false)

  const [fullScreenReview, setFullScreenReview] = useState();




  const handleSortingTypeChange = async(newSortingType) =>{

    setShrinkReview(true);



    const fetchReviews = async()=>{

    const response = await fetch("/api/getreviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product_id,
        starting_position: 0,
        limit: 20,
        sortingType: newSortingType

      }),
    });

    if (response.ok) {

      const data = await response.json();

      console.log('response ok, ', data)


      


      newReviews.current = data.reviews; // Load 6 more reviews
      setReviews(data.reviews);
      setLoadButtonExists(true);
    
    } 
    else{
      console.log('response not ok, ', response)
    }
  }


  






    setTimeout(async()=>{
      setSortingType(newSortingType);

      await fetchReviews();

      setTimeout(()=>{setShrinkReview(false)},200);
      
      

    }, 500)
  

  }


  

  useEffect(()=>{
    
    


    setSortingType("featured")

      setReviews(startReviews);

    

      newReviews.current = startReviews; // Load 6 more reviews
      
 
      setLoadButtonExists(true);
  


  },[product_id, startReviews])





  const handleShowMore= useCallback( async () => {
    if (isLoading) {
      // Prevent multiple clicks while the operation is in progress
      return;
    }

    setIsLoading(true);
    console.log('Review info before', newReviews.current, ' | ', reviews);

    try {


      let currentReviewLength= reviews.length;
      const index = reviews.length - 1;


        
        
      if(index < newReviews.current.length-9){
       
          setReviews([
            ...reviews,
            ...newReviews.current.slice(index + 1, index + 9),
          ]);
          currentReviewLength= currentReviewLength + 8;
        }
     

          
        

      

        //index != newReviews.current.length - 1 je stavljeno cisto onako, mozda izbaciti
       
        
      

    else{

      const response = await fetch("/api/getreviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product_id,
          starting_position: currentReviewLength,
          sortingType: sortingType
        }),
      });

      if (response.ok) {
        const data = await response.json();

     



       
        if (data.reviews.length === 0) 
        {
          setReviews([
            ...reviews,
            ...newReviews.current.slice(index+1, newReviews.current.length)
          ]);
          setLoadButtonExists(false);
        
        }


    



        setReviews([
          ...reviews,
          ...data.reviews.slice(0,8)
        ]);

      

        newReviews.current = [...data.reviews.slice(8,data.reviews.length)]; // Load 6 more reviews

   

      
      } else {
        throw new Error("Network response was not ok.");
      }
    } 
    
  }catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  },[isLoading, reviews, newReviews.current, sortingType])











  return (
    <div className={styles.mainDiv} id="customerReviews">
      <h1>Customer Reviews</h1>

      
   <WriteReviewVisible ratingData={ratingData} sortingType={sortingType} setSortingType={handleSortingTypeChange}/>









    


      <div  id='masonry'  className={styles.masonry}>
          {reviews.map((review, index) => {
            return (
              <Review
                key={index}
                setFullScreenReview={setFullScreenReview}
                name={review.name}
                text={review.text}
                stars={review.stars}
                product_id={product_id}
                imageNames={review.imageNames} //popravi ovo
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
          {isLoading?"Loading...":"Show more"}
        </button>
      )}
      {fullScreenReview && <FullScreenReview authorName={fullScreenReview.authorName} text={fullScreenReview.text} stars={fullScreenReview.stars} 
      imageSrc={fullScreenReview.imageSrc} setFullScreenReview={setFullScreenReview}/>}
    </div>
  );
}












// {imageNames &&
//   JSON.parse(imageNames).map((image, index) => {
//     return (
//       <Image
//         key={index}
//         height={0}
//         width={0}
//         src={`/images/review_images/productId_${product_id}/${image}`}
//         alt="review image"
//         loading={"lazy"}
//         sizes="(max-width: 580px) 100vw, (max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
//         className={styles.reviewImage}
//       />
//     );
//   })}