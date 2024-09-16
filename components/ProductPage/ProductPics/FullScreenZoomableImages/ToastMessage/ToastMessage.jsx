import  {  useLayoutEffect, useRef } from 'react';
import styles from './toastmessage.module.css'

export default function ToastMessage({showToastMessage, setShowToastMessage}) {

    const toastTimeout=useRef();
    const toastRef= useRef();


    useLayoutEffect(()=>{

       
        const toast = toastRef.current;
        

       
        if(showToastMessage===1){
       

        toastTimeout.current= setTimeout(()=> {
           
            if(toast){
            
            toast.classList.add(styles.dissapearingToast);      
      
            setTimeout(()=>{
              global.toastMessageNotShowable=true;
              setShowToastMessage(0);
              
            },500);
            
            
          }
          },
          4500);
        }




        else if(showToastMessage===2){

            clearTimeout(toastTimeout.current);
          
               
                if(toast){
                    toast.classList.add(styles.dissapearingToast); 

                 
                setTimeout(()=>{  global.toastMessageNotShowable=true;setShowToastMessage(0)},300)    
                } 
            
        }

        else if(showToastMessage===3){
            clearTimeout(toastTimeout.current);
          
              if(toast){
                toast.classList.add(styles.instantDissapearingToast);
             
                global.toastMessageNotShowable=true;
                setTimeout(()=>{  global.toastMessageNotShowable=true;setShowToastMessage(0)},150)    
              }
        
        
            
        }

    },[showToastMessage, toastRef])


   

  return (
    <div ref={toastRef} className={styles.toast}>Double tap to zoom</div>
  )
}
