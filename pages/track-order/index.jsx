import { useRef } from "react";
import styles from './trackorder.module.css'


import Head from "next/head";

export default function TrackOrder() {

    const trackInputRef = useRef();
       
    
    const trackOrder= (event)=>{

        trackInputRef.current.value=''
     
    }

  return (
  
      <div className={styles.mainDiv}>

      <div className={styles.trackDiv}>
        <input className={styles.trackIdInput} ref={trackInputRef}></input>
        <button className={styles.trackNow}
        onClick={(event)=>{trackOrder(event)}}>Track</button>
    </div>

      </div>
       
    
  );
}
