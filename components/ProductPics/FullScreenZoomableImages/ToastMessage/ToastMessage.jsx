import React, { useEffect, useRef } from 'react';
import styles from './toastmessage.module.css'

export default function ToastMessage({showToastMessage, setShowToastMessage}) {

    const toastTimeout=useRef();
    const toastRef= useRef();


    useEffect(()=>{

       
        const toast = toastRef.current;
        


    },[showToastMessage, toastRef])


   

  return (
    <div ref={toastRef} className={styles.toast}>Double tap to zoom</div>
  )
}
