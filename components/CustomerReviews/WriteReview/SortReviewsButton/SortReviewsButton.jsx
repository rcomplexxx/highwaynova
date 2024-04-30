import React, { useState } from 'react'
import styles from './sortreviewsbutton.module.css'
import Image from 'next/image'

export default function SortReviewsButton({sortingType, setSortingType}) {

    const [openSortingDiv, setOpenSortingDiv] = useState(false);


  

  return (
    <div  className={styles.mainButton}>

        <Image src={`/images/customer_review_sort7.svg`} onClick={()=>{setOpenSortingDiv(!openSortingDiv)}} height={0} width={0} className={styles.sortingImg}/>


{openSortingDiv &&
        <div className={`${styles.sortingDiv}`}>
          
          <span className={styles.sortByText}>Sort by</span>

            <span onClick={()=>{setOpenSortingDiv(false);setSortingType('featured')}} className={`${styles.sortingOption} ${sortingType==="featured" && styles.sortingOptionSelected}`}>
            Featured
            </span>

            <span onClick={()=>{setOpenSortingDiv(false);setSortingType('new')}} className={`${styles.sortingOption} ${sortingType==="new" && styles.sortingOptionSelected}`}>
            New
            </span>

            <span onClick={()=>{setOpenSortingDiv(false);setSortingType('highest_ratings')}} className={`${styles.sortingOption} ${sortingType==="highest_ratings" && styles.sortingOptionSelected}`}>
            Highest ratings
            </span>

            <span onClick={()=>{setOpenSortingDiv(false);setSortingType('lowest_ratings')}} className={`${styles.sortingOption} ${sortingType==="lowest_ratings" && styles.sortingOptionSelected}`}>
            Lowest ratings
            </span>
        </div>
}
        

    </div>
  )
}



