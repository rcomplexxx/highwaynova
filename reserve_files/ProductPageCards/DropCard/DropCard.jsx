import Image from "next/image";
import styles from "./dropCard.module.css";
import { useEffect, useRef, useState } from "react";

export default function DropCard(props) {
  const [showAnswer, setShowAnswer] = useState(false);

  function summonAnswer() {
    setShowAnswer(!showAnswer);
  }

  const dropCardAnswerRef= useRef();


    const mounted= useRef(false);
    const emergeTimeoutRef = useRef();
 

    
  useEffect(()=>{
    if(!mounted.current){mounted.current=true; return;}
   
    
    let myAnswer=dropCardAnswerRef.current;
  
 
    
  
  if(showAnswer){


 
    myAnswer.style.maxHeight=`${myAnswer.scrollHeight}px`;
    emergeTimeoutRef.current= setTimeout(()=>{
      myAnswer.style.maxHeight='none'
    },500);
    
  }
  else{

    clearTimeout(emergeTimeoutRef.current);
   

    myAnswer.style.maxHeight=`${myAnswer.scrollHeight}px`;
    setTimeout(()=>{
      myAnswer.style.transition=`max-height 0.5s ease`;
      myAnswer.style.maxHeight="0";
     }, 1)
  
   
  }


  },[showAnswer, mounted.current]);













  return (
    <div className={styles.dropDiv}>
      <button className={styles.title_div} onClick={summonAnswer}>
        <div className={styles.titleStyleDiv}>
        <Image height={16} width={16} sizes="16px" loading="lazy" src={`/images/${props.title=='Description'?'description_icon6':
      props.title=='Key features'?'keyIcon7':props.title=='Shipping & Returns'?'shippingReturnIcon2'
      :props.title=='Ask a question'?'chatIcon6':'description'
      }.png`} className={styles.cardIcon}/>
        {props.title}
        </div>
        <ArrowDown color={"var(--dropcard-title-color)"} styleClassName={`${styles.plusStyle} ${
            showAnswer && styles.plusStyleRotate
          }`}/>
         
      </button>
      <div
      id={`dropCardAnswer${props.dropCardId}`}
      ref={dropCardAnswerRef}
        className={`${styles.emerge} ${
          showAnswer && props.contactCard && styles.borderRad
        }`}
      >
        {props.children}
      </div>
    </div>
  );
}
