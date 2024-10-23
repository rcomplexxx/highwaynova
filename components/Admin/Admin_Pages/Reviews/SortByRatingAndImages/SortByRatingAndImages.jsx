

import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import styles from './sortbyratingandimages.module.css'


export default function SortByRatingAndImages({productId,  setReviews}) {

    const sort = async()=>{


      
        if (!await adminConfirm("Continue with sorting reviews? Changes cannot be automatically undone.")) return;


        

            await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataType: "update_reviews_reorder", data: {product_id: productId} }),
            })
              .then((response) => {
                if (response.ok) {
                  setReviews([]);
              
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
