import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from "next/image";
import styles from './fullscreenreview.module.css';
import ReactHtmlParser from "react-html-parser";
import {  Stars } from '@/public/images/svgs/svgImages';
import { CancelIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';
import { useRouter } from 'next/router';
    

export default function FullScreenReview({authorName, text, stars, imageSrc, setFullScreenReview}) {


    const [imageLoaded, setImageLoaded] = useState(false);
  
   
    const reviewImageRef= useRef();
  

  
    const {increaseDeepLink, decreaseDeepLink } = useGlobalStore((state) => ({
   
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
    }));

    


    const router = useRouter();











useEffect(()=>{

 

  const handlePopState = ()=>{

    if(global.deepLinkLastSource !== 'review_zoomed') return;

    setFullScreenReview(false);
  
  }




  
  increaseDeepLink('review_zoomed',true);



  window?.addEventListener("popstate", handlePopState);
  
  



  return ()=>{

   
    window?.removeEventListener("popstate", handlePopState);
    
    
    decreaseDeepLink();
   

  }
  
},[])




useLayoutEffect(()=>{
  if(imageLoaded && imageSrc  && window.innerWidth>600) {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = reviewImageRef.current;
    const widthIsBigger = naturalWidth > naturalHeight;
    const imageClientSmallerSize = widthIsBigger ? clientWidth/naturalWidth * naturalHeight : clientHeight/naturalHeight * naturalWidth;

    //widthIsBigger==true, Width je veci tj 100% od parent div, tako da trebam da zumiram height

    if(widthIsBigger){
      if(imageClientSmallerSize < 640 && imageClientSmallerSize > 576){
        reviewImageRef.current.style.width = 'auto';
        reviewImageRef.current.style.height = '100%';
      }
    } else if(imageClientSmallerSize < 512 && imageClientSmallerSize > 464){
      reviewImageRef.current.style.width = '100%';
      reviewImageRef.current.style.height = 'auto';
    }
  }
}, [imageLoaded]);











  return (
    <div onClick={()=>{if(window.innerWidth>600) router.back();}} className={styles.mainWrapper}>

      
<div onClick={(event)=>{event.stopPropagation()}} className={`${styles.mainDiv} 
${(imageSrc?imageLoaded:true) && styles.spawnFullScreenReview}`}>

<CancelIcon color={"var(--fullscreen-customer-cancel-icon-color)"} styleClassName={`${styles.closeFullScreen} ${!imageSrc && styles.closeFullScreenNoImg}`}  
handleClick={()=>{router.back();}}
   />
   {imageSrc && <div className={styles.reviewImageDiv}>

        <Image
        src={imageSrc}
        ref={reviewImageRef}
        height={0} width={0}
        sizes='(max-width: 600px) 100vw, 448px'
        
        loading='eager'
        //za mobilni je 100vw, inace ima tacno odredjeno
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
        className={styles.reviewImage}
        />

    </div>
}

    <div className={`${styles.reviewDiv} ${!imageSrc && styles.reviewDivNoImg}`}>
        <div className={styles.authorDiv}>
        <span className={styles.authorName}>{authorName}</span>
        
       
        {/* <div className={styles.verifiedPurchaseDiv}>
        <Image src='/images/correct.png' height={0} width={0} sizes='24px'
        className={styles.verifiedImage}/>
        <span>Verified purchase</span>
        </div> */}



        </div>
       

<Stars ratingNumber={parseInt(stars, 10)} starClassName={styles.starClassName}/>

        <div className={styles.reviewText}>
        {ReactHtmlParser(text)}
        </div>

        
        </div>

        
        
      
        </div>


    </div>
  )
}
