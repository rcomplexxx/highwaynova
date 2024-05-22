import React, { useRef, useState } from 'react'
import styles from './sortbyratingandimages.module.css'
import Image from 'next/image'

export default function SortByRatingAndImages({productId,  setOldReviews, clearAfterReviewsSave}) {

    const sort = async()=>{


        const answer = confirm("Continue with sorting reviews? Changes cannot be undone.");



        if(!answer)return;

            await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataType: "send_reviews_reorder", data: {product_id: productId} }),
            })
              .then((response) => {
                if (response.ok) {
                  setOldReviews(["reset_data"]);
                  clearAfterReviewsSave();
              
                }
              })
      
              .catch((error) => {});
         
        };

    

   

  return (
    <button className={styles.swapImgRevsToStartButton} onClick={sort}>
   Sort by Rating and Images
    </button>
   

  )
}
