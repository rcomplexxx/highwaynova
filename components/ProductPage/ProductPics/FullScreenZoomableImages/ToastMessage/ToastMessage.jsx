import  {  useLayoutEffect, useRef } from 'react';
import styles from './toastmessage.module.css'

export default function ToastMessage({showToastMessage, setShowToastMessage}) {

    const toastTimeout=useRef();
    const toastRef= useRef();


    useLayoutEffect(() => {
      const toast = toastRef.current;
    
      if (toast) {
        const handleToastDisappearance = (timeout, animationClass) => {
          toast.classList.add(animationClass);
          setTimeout(() => {
            global.toastMessageNotShowable = true;
            setShowToastMessage(0);
          }, timeout);
        };
    
        if (showToastMessage === 1) {
          toastTimeout.current = setTimeout(() => {
            handleToastDisappearance(500, styles.dissapearingToast);
          }, 4500);
        } else if (showToastMessage === 2) {
          clearTimeout(toastTimeout.current);
          handleToastDisappearance(300, styles.dissapearingToast);
        } else if (showToastMessage === 3) {
          clearTimeout(toastTimeout.current);
          handleToastDisappearance(150, styles.instantDissapearingToast);
        }
      }
    
    }, [showToastMessage, toastRef]);


   

  return (
    <div ref={toastRef} className={styles.toast}>Double tap to zoom</div>
  )
}
