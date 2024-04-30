import React, { useRef, useState } from 'react'
import styles from './shufflecommonreviews.module.css'
import Image from 'next/image';

export default function ShuffleCommonReviews({reviews, setReviewsArray}) {

    const [shuffled,setShuffled] = useState(false)


    const shuffleReviews= ()=>{


let shuffledReviews= [...reviews]

for (let i = shuffledReviews.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
    // Swap shuffledReviews[i] and shuffledReviews[j]
    [shuffledReviews[i].id, shuffledReviews[j].id] = [shuffledReviews[j].id, shuffledReviews[i].id];
  }

  shuffledReviews= shuffledReviews.map(rev =>{return {...rev, changed:true}});

  console.log('current revs', shuffledReviews)


  setReviewsArray(shuffledReviews);

  setShuffled(true)
    }


    
 
    
    
      return (
        <button className={styles.sortRatingButton} onClick={shuffleReviews}>
        Shuffle common reviews
        {shuffled && <Image src='/images/correct.png' className={styles.sortedSuccessfullImage} height={20} width={20}/>}
      </button>
       
    
      )
    }
    
