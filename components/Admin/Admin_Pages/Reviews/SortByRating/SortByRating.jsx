import { useRef, useState } from 'react'
import styles from './sortbyrating.module.css'
import Image from 'next/image'

export default function SortByRating({reviews, setReviewsArray}) {

    const updatedReviewsArrayRef = useRef([]);
    const [sorted, setSorted] = useState(false);


    const smallestIdNumber = useRef(0);


    const getLowestIdOfArray=(array, previousLowest)=>{

        if(array.length===0)return null;
        let smallestId=previousLowest?previousLowest:array[0].id;
        array.forEach(element => {
            if(element.id<smallestId)smallestId=element.id
        })
        return smallestId==previousLowest?null:smallestId;
    }


    const getHighestIdOfArray=(array, previousHighestSwapId, currentRating=1)=>{

        if(array.length===0)return null;

        let highestId=0;
        console.log('revs', array);

      
       
        array.forEach(element => {
            if(element.id>highestId && element.stars>currentRating && 
                (!previousHighestSwapId || element.id<previousHighestSwapId))highestId=element.id
        })

     
   

    console.log('highestId',highestId)
        return highestId;
    }

  

  




    const swapRevsWithImagesToBeginning=()=>{


     

        if(!reviews || reviews.length===0 || sorted)return;


        let highestSwapId = getHighestIdOfArray(reviews)

        for(let i = 1 ; i<5; i++){

           

        const reviewsByRating= reviews.filter(review => review.stars == i);
        console.log('revs of rating' + i+ ' '+ reviewsByRating);

         

     

            reviewsByRating.forEach(review=>{


                console.log('highest swap id', highestSwapId)

                if(review.id<highestSwapId)
                {

                    updatedReviewsArrayRef.current.push({
                        id: review.id,
                        changed: true,
                        name: review.name,
                        text: review.text,
                        stars: review.stars,
                        imageNames: review.imageNames,
                        deleted: false,
                        swapId: highestSwapId
                    });
    
    
    
                    highestSwapId = getHighestIdOfArray(reviews, highestSwapId, i)

                }
            })



       







        }

        setReviewsArray(updatedReviewsArrayRef.current);
        updatedReviewsArrayRef.current = [];
        setSorted(true);

    }

       
              
    


  return (
    <button className={styles.sortRatingButton} onClick={swapRevsWithImagesToBeginning}>
    Sort reviews by rating (Warning: Must be sorted a few times.)
    {sorted && <Image src='/images/correct.png' className={styles.sortedSuccessfullImage} height={20} width={20}/>}
  </button>
   

  )
}
