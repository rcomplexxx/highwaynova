import  { useRef, useState } from 'react'
import styles from './swapimgrevs.module.css'
import Image from 'next/image'

export default function SwapImageRevsButtons({reviews, setReviewsArray}) {

    const updatedReviewsArrayRef = useRef([]);
    const [swapped, setSwapped] = useState(false);



  

  


    const lastRevWithoutImageIdRef= useRef(0);

    const swapRevsWithImagesToBeginning=()=>{
        if(!reviews || reviews.length===0 || swapped)return;

        for(let i = 0 ; i<=5; i++){

        const reviewsByRating= reviews.filter(review => review.stars == i);
        console.log('revs of rating' + i+ ' '+ reviewsByRating);

        lastRevWithoutImageIdRef.current=0;
        reviewsByRating.forEach((review, index)=>{


            if(review.imageNames){

                console.log('rev with img detected, id: ', review.id);

                console.log('..', lastRevWithoutImageIdRef.current)
              
                while(true){

                    if(lastRevWithoutImageIdRef.current>=reviewsByRating.length-1)break;
                    if(lastRevWithoutImageIdRef.current>index)break;
                    
                    if(!reviewsByRating[lastRevWithoutImageIdRef.current].imageNames){


                        console.log('testid id', review.id)

                        updatedReviewsArrayRef.current.push(

                            {
                            id: reviewsByRating[lastRevWithoutImageIdRef.current].id,
                            changed: true,
                            name:  reviewsByRating[lastRevWithoutImageIdRef.current].name,
                            text: reviewsByRating[lastRevWithoutImageIdRef.current].text,
                            stars: reviewsByRating[lastRevWithoutImageIdRef.current].stars,
                            imageNames: null,
                            deleted: false,
                            swapId:review.id
                        }

  
                            
                            
                          );
                          lastRevWithoutImageIdRef.current= lastRevWithoutImageIdRef.current +1;
                          break;
                        
                    }

                    lastRevWithoutImageIdRef.current= lastRevWithoutImageIdRef.current+1;
                    
                }
                    
            }



        })

    }

       
                setReviewsArray(updatedReviewsArrayRef.current);
                updatedReviewsArrayRef.current = [];
                lastRevWithoutImageIdRef.current=0;
                setSwapped(true);
    }


  return (
    <button className={styles.swapImgRevsToStartButton} onClick={swapRevsWithImagesToBeginning}>
    Swap image reviews for non-image reviews(swap happens per rating. It's suggested to first sort by rating.)
    {swapped && <Image src='/images/correct.png' className={styles.swappedSuccessfulImage} height={20} width={20}/>}
  </button>
   

  )
}
