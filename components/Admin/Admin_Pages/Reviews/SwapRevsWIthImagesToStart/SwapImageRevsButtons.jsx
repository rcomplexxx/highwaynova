import React, { useRef, useState } from 'react'
import styles from './swapimgrevs.module.css'
import Image from 'next/image'

export default function SwapImageRevsButtons({reviews, setReviewsArray}) {

    const updatedReviewsArrayRef = useRef([]);
    const [swapped, setSwapped] = useState(false);



  

  


    const lastRevWithoutImageIdRef= useRef(0);

    const swapRevsWithImagesToBeginning=()=>{
        if(!reviews || reviews.length===0 || swapped)return;

        


        reviews.forEach((review, index)=>{


            if(review.imageNames){

                console.log('rev with img detected, id: ', review.id);

                console.log('..', lastRevWithoutImageIdRef.current)
              
                let loopAllowed = true;
                while(true){

                    if(lastRevWithoutImageIdRef.current>=reviews.length-1)break;
                    if(lastRevWithoutImageIdRef.current>index)break;
                    
                    if(!reviews[lastRevWithoutImageIdRef.current].imageNames){


                        console.log('testid id', review.id)

                        updatedReviewsArrayRef.current.push(

                            {
                            id: reviews[lastRevWithoutImageIdRef.current].id,
                            changed: true,
                            name:  reviews[lastRevWithoutImageIdRef.current].name,
                            text: reviews[lastRevWithoutImageIdRef.current].text,
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

       
                setReviewsArray(updatedReviewsArrayRef.current);
                updatedReviewsArrayRef.current = [];
                lastRevWithoutImageIdRef.current=0;
                setSwapped(true);
    }


  return (
    <button className={styles.swapImgRevsToStartButton} onClick={swapRevsWithImagesToBeginning}>
    Swap image reviews for non-image reviews
    {swapped && <Image src='/images/correct.png' className={styles.swappedSuccessfulImage} height={20} width={20}/>}
  </button>
   

  )
}
