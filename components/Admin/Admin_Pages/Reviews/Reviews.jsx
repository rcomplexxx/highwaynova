import styles from "./reviews.module.css";

import { useState } from "react";
import GetDataButton from "../MagicButtons/GetDataButton";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";
import ReviewsCard from "./ReviewsCard/ReviewsCard";


import SortByRatingAndImages from "./SortByRatingAndImages/SortByRatingAndImages";
import { adminAlert } from "@/utils/utils-client/utils-admin/adminAlert";
import UpdateDataButton from "../MagicButtons/UpdateDataButton";
import { useAdminStore } from "../../AdminZustand";

export default function Reviews() {
  const [page, setPage] = useState(0);
  const [productId, setProductId] = useState();


 
  
    const { reviews, setReviews } = useAdminStore();
  

  
 

  const handleReviewsChange = (id, changed, name, text, imageNames, stars, deleted, swapId) => {
    if (swapId && !reviews.some(review => review.id === Number(swapId))) {
      return adminAlert('error', 'Error', `Cannot swap review ${id} with a non-existent or different product review (${swapId}).`);
    }
  
    setReviews(reviews.map(r => r.id === id 
      ? { ...r, changed, name, text, imageNames, stars, deleted, swapId } 
      : r)
      .concat(reviews.some(r => r.id === id) ? [] : [{ id, changed, name, text, imageNames, stars, deleted, swapId }])
    );
  };

 
  

  const initializeReviewsData = (data) => {
    
    setReviews(data.map((review) => ({ ...review, changed: false })));
  };




  

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Reviews{reviews && <span> ({reviews.length})</span>}</h1>
        {reviews.length !== 0 ? (
          <>
          <UpdateDataButton

           dataName={'reviews'}  
            newData={reviews.filter(r => r.changed) .map(({ id, name, text, imageNames, stars, deleted, swapId }) => ({
              id: id.toString(),
              name,
              text,
              imageNames,
              stars,
              deleted: deleted || false,
              swapId: swapId || null,
            })
          
          )}
            dataType="update_reviews"
           
          />


          <SortByRatingAndImages productId={productId}  
          setReviews={setReviews}
            />
         

          </>
        ) : (
          <div className={styles.reviewGetterDiv}>
            <label>Product id</label>
            <input
              id="product_id"
              className={styles.reviewIdInput}
              value={productId}
              placeholder="Enter product id"
              onChange={(event) => {
                const inputNumber = parseInt(event.target.value, 10);
                if (!isNaN(inputNumber)) setProductId(inputNumber);
                if (event.target.value === "") setProductId("");
              }}
            />

            <GetDataButton
              name="Reviews"
              reqData={{ product_id: productId }}
              dataType={"get_reviews"}
              setData={initializeReviewsData}
              
            />
             
          </div>
        )}
      </div>

      {reviews.slice(page * 10, (page + 1) * 10).map((review, index) => (
  <ReviewsCard
    key={page * 10 + index}
    index={page * 10 + index}
    id={review.id}
    name={review.name}
    text={review.text}
    stars={review.stars}
    productId={productId}
    imageNames={review.imageNames}
    changed={review.changed}
    handleReviewsChange={handleReviewsChange}
  />
))}
      

      <PageIndexButtons data={reviews} page={page} setPage={setPage} />
    </>
  );
}
