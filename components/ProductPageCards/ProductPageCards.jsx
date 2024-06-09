import Image from "next/image";
import DropCard from "./DropCard/DropCard";
import styles from "./productPageCards.module.css";


import ProductDescription from "../ProductDescription2/ProductDescription";
import ContactUsCard from "./ContactUsCard/ContactUsCard";
import TrustIcons from "./TrustIcons/TrustIcons";
import { useEffect, useRef, useState } from "react";
import Shipping from "./Shipping/Shipping";

export default function ProductPageCards({description}) {

  const [selectedCard, setSelectedCard] = useState(0);

  const [firstDivStyle, setFirstDivStyle] = useState(true);

  const cardDivRef = useRef();
  const openCardTimeout = useRef();


  useEffect(()=>{

    const cardDiv = cardDivRef.current;




    clearTimeout(openCardTimeout.current);

    
    cardDiv.style.maxHeight=`${cardDiv.scrollHeight}px`;
    cardDiv.style.opacity = "1";

   openCardTimeout.current = setTimeout(()=>{  cardDiv.style.maxHeight='none'}, 300)

  },[selectedCard])





  const handleCardChange = (cardNumber)=>{
    
   

    const cardDiv = cardDivRef.current;




    clearTimeout(openCardTimeout.current);




     cardDiv.style.maxHeight=`${ cardDiv.scrollHeight}px`;


    
    setTimeout(()=>{
      cardDiv.style.maxHeight="0";
      cardDiv.style.opacity = "0";


    
      openCardTimeout.current= setTimeout(()=>{

        setFirstDivStyle(false);

        setSelectedCard(cardNumber);

      },300);


     }, 1)
     
    





  

  }
 

  return (
    <>
    <div className={styles.productInfoMenuDiv}>
        <span onClick={()=>{handleCardChange(0)}} className={`${styles.productInfoMenuSpan} ${selectedCard === 0 && styles.menuSpanSelected}`}>Details</span>
        <span onClick={()=>{handleCardChange(1)}} className={`${styles.productInfoMenuSpan} ${selectedCard === 1  && styles.menuSpanSelected}`}>Free shipping</span>
        <span onClick={()=>{handleCardChange(2)}} className={`${styles.productInfoMenuSpan} ${selectedCard === 2  && styles.menuSpanSelected}`}>Questions</span>
    </div>
    <div key={selectedCard} ref = {cardDivRef} className={`${styles.cardDiv} ${firstDivStyle && styles.cardDivFirstStyle}`}>


    {selectedCard=== 0? <ProductDescription description = {description}/>:
      selectedCard=== 1?
       <Shipping/>:
    
    <ContactUsCard/>

      
}



</div>

     <TrustIcons/>
    </>
  );
}
