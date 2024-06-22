import Image from "next/image";
import styles from "./dropCard.module.css";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ChatIcon, PackageReturnIcon } from "@/public/images/svgs/svgImages";

export default function DropCard(props) {
  const [showAnswer, setShowAnswer] = useState(false);

 

  const dropCardAnswerRef= useRef();


 
    const emergeTimeoutRef = useRef();
 




    

  function summonAnswer() {
    setShowAnswer(!showAnswer);


      
    
    let myAnswer=dropCardAnswerRef.current;
  
 
    
  
  if(showAnswer){


    clearTimeout(emergeTimeoutRef.current);
   

    myAnswer.style.maxHeight=`${myAnswer.scrollHeight}px`;
    setTimeout(()=>{
      myAnswer.style.maxHeight="0";
      myAnswer.style.opacity = "0";
     }, 1)
  
   
   
    
  }
  else{


    myAnswer.style.maxHeight=`${myAnswer.scrollHeight}px`;
    myAnswer.style.opacity = "1";
    emergeTimeoutRef.current= setTimeout(()=>{
      myAnswer.style.maxHeight='none'
    },500);





  }




  }








 /* --dropcard-title-color: var(--high-contrast-txt-color);
 --dropcard-selected-title-border: var(--main-color-5);
 --description-content-color: var(--neutral-6); */


  return (
    <div className={styles.dropDiv}>
      <button className={styles.title_div} onClick={summonAnswer}>
        <div>

      {props.title ==='Shipping & Returns' && <PackageReturnIcon isDropCardIcon={true} styleClassName={styles.cardIcon}/>}
      {props.title ==='Ask a question' && <ChatIcon styleClassName={styles.cardIcon}/>}
        {props.title}
        </div>
        <ArrowDown color={"var(--dropcard-title-color)"} styleClassName={`${styles.plusStyle} ${
            showAnswer && styles.plusStyleRotate
          }`}/>
    
         
      </button>

      
      <div
      id={`dropCardAnswer${props.dropCardId}`}
      ref={dropCardAnswerRef}
        className={`${styles.emerge}`}
      >
        {props.children}
      </div>
    </div>
  );
}
 /* --dropcard-title-color: var(--high-contrast-txt-color);
 --dropcard-selected-title-border: var(--main-color-5);
 --description-content-color: var(--neutral-6); */