import  { useRef, useState } from 'react'
import styles from './swapimgrevs.module.css'
import Image from 'next/image'

export default function SwapImageRevsButtons({reviews, setReviewsArray}) {

    
    const [swapped, setSwapped] = useState(false);



  

  


    

    const swapRevsWithImagesToBeginning = () => {
        if (!reviews || reviews.length === 0 || swapped) return;
    
        const updatedReviews = [];
    
        for (let i = 1; i <= 5; i++) {




            let lastRevIdWithoutImage = 0;


            const reviewsByRating = reviews.filter(review => review.stars === i);
            console.log(`Reviews of rating ${i}:`, reviewsByRating);


            //za svaki review sa ratingom i
            reviewsByRating.forEach((review, index) => {

                    //ako poseduje sliku
                if (!review.imageNames) return;
                    
                    console.log('Review with image detected, id:', review.id);

                   
                    
                        //preispitati sve prethodne reviewe sa ratingom i
                        for(let j = lastRevIdWithoutImage; i<index; j++){

                            //pronaci taj prethodni review za preispitivanje
                        const currentReview = reviewsByRating[j];
                        
                            //Ako taj review za preispitivanje ne poseduje sliku, izpushati u updatovan array taj review,  
                            //sa swapId-om reviewa sa slikom radi zamene koja ce se izvrsiti u admin check(preko swap reviewa)
                        if (!currentReview.imageNames) {
                            console.log('Swapping id:', review.id);
    
                            updatedReviews.push({
                                id: currentReview.id,
                                changed: true,
                                name: currentReview.name,
                                text: currentReview.text,
                                stars: currentReview.stars,
                                imageNames: null,
                                deleted: false,
                                swapId: review.id,
                            });
    
                            lastRevIdWithoutImage = j;
                            break; // Break after a successful swap
                        }
    
                        
                    }
               
            });
        }
    
        //To se setuje u setReviewsArray, sto se kasnije obradjuje dalje jer se tu smestaju reviewi koji su promenjeni, s toga je changed:true gore 
        //ubaceno, sto se prepoznaje u adminCheck
        setReviewsArray(updatedReviews);  
        setSwapped(true);
    };



  return (
    <button className={styles.swapImgRevsToStartButton} onClick={swapRevsWithImagesToBeginning}>
    Swap image reviews for non-image reviews(swap happens per rating. It's suggested to first sort by rating.)
    {swapped && <Image src='/images/correct.png' className={styles.swappedSuccessfulImage} height={20} width={20}/>}
  </button>
   

  )
}
