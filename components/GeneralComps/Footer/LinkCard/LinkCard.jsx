import {  useRef, useState } from 'react';
import styles from './linkcard.module.css'
import Image from 'next/image';
import { ArrowDown } from '@/public/images/svgs/svgImages';

export default function LinkCard({title, children}) {

    const [cardOpen, setCardOpen] = useState(false);
    
    const cardContentRef=useRef();
    const maxHeightTimoutAdj = useRef();

 


    
    const handleCardExpend = () => {
      clearTimeout(maxHeightTimoutAdj.current);
      const cardContentDiv = cardContentRef.current;
    
      if (!cardOpen) {
        cardContentDiv.style.maxHeight = `${cardContentDiv.scrollHeight}px`;
        maxHeightTimoutAdj.current = setTimeout(() => cardContentDiv.style.maxHeight = 'none', 300);
      } else {
        cardContentDiv.style.transition = 'max-height 0s ease';
        cardContentDiv.style.maxHeight = `${cardContentDiv.scrollHeight}px`;
        setTimeout(() => {
          cardContentDiv.style.transition = 'max-height 0.3s ease';
          cardContentDiv.style.maxHeight = '0';
        }, 1);
      }
    
      setCardOpen(!cardOpen);
    };


  return (
    <div className={styles.footerLinksWrapper}>
        <div onClick={handleCardExpend} className={styles.linksCard}>
        <span className={styles.title}>{title}</span>
        <ArrowDown color='var(--footer-title-color)' styleClassName={`${styles.dropMenuSign} ${cardOpen && styles.dropMenuOpen}`}/>
       
        </div>
        <div ref={cardContentRef} className={styles.linksContent}>
            {children}
            </div>
            </div>
  )
}
