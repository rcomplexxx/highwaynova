

import styles from "./productPageCards.module.css";


import ProductDescription from "./ProductDescription2/ProductDescription";
import ContactUsCard from "./ContactUsCard/ContactUsCard";
import TrustIcons from "./TrustIcons/TrustIcons";
import { useEffect, useRef, useState } from "react";
import Shipping from "./Shipping/Shipping";

export default function ProductPageCards({description}) {

  const [selectedCard, setSelectedCard] = useState(0);

  const [firstDivStyle, setFirstDivStyle] = useState(true);

  const cardDivRef = useRef();

  

  useEffect(()=>{

    const cardDiv = cardDivRef.current;




   setTimeout(()=>{
    
    cardDiv.style.transform=`translateY(0)`;
    cardDiv.style.opacity = "1";

    },1);

  
    

  },[selectedCard])





  const handleCardChange = (cardNumber)=>{
    
   
    if(cardNumber=== selectedCard)return;

    const cardDiv = cardDivRef.current;




    



    
    

    


        setFirstDivStyle(false);

        setSelectedCard(cardNumber);



        
    





  

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
