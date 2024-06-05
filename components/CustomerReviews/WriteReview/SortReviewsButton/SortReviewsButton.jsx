import { useEffect, useState } from 'react'
import styles from './sortreviewsbutton.module.css'
import { SortButtonIcon } from '@/public/images/svgs/svgImages';

export default function SortReviewsButton({sortingType, setSortingType}) {

    const [openSortingDiv, setOpenSortingDiv] = useState(false);



    useEffect(()=>{

  
        const handleClick= (event)=>{
        
      
            setOpenSortingDiv(false);
        }
    
    
       if(openSortingDiv) {
    
        document.addEventListener("click", handleClick)
    
    
       }
    
       return ()=>{ 
        document.removeEventListener("click", handleClick)
      
      }
      
    
    }, [openSortingDiv])


  

  return (
    <div onClick={(event)=>{event.stopPropagation();}} className={styles.mainButton}>

      <SortButtonIcon handleClick={()=>{setOpenSortingDiv(!openSortingDiv)}}
       styleClassName={styles.sortingImg} />

        


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



