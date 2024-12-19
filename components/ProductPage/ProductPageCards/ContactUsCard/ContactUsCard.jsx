import { useRef, useState } from 'react'
import styles from './contactuscard.module.css'
import { ErrorIcon } from '@/public/images/svgs/svgImages';
import ContactForm from '@/components/ContactForm/ContactForm';

export default function ContactUsCard() {



  

  return   <div className={styles.mainContactDiv}>
        
        <div className={styles.mainSpan}>Ask a question</div>


    <span className={styles.getInTouch}>Please note, we will respond to you by email within 24-48 hours. Please include as much details as possible to help us understand your requirements.</span>
    

  <ContactForm messageLabel='Question'/>    

  </div>
  

  
}
