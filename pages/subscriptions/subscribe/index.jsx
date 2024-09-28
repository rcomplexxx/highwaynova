
import { useEffect, useRef, useState } from 'react'
import styles from './subscribe.module.css'
import { CancelIcon, ErrorIcon } from '@/public/images/svgs/svgImages';

export default function Subscribe() {

  const [subscribeSuccess, setSubscribeSuccess]= useState(false);

  const [emailFieldError, setEmailFieldError] = useState(false);

    const emailInputRef = useRef()


  
    
    const handleSubscribe = async(event)=>{
      
      if (!/^\w+@\w+\.\w+$/.test(emailInputRef.current.value)) {
        console.log('error');
        setEmailFieldError("Please enter a valid email address.");
        return;
      }


        try {
            const response = await fetch("/api/sqlliteapi", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "subscribe",
                email: emailInputRef.current.value,
                source: "re_subscribe",
              }),
            });
        
            if (response.ok) {
              setSubscribeSuccess(true);
             
            } else {
              setEmailFieldError("Server error. Please try again later.")
            }
          } catch (error) {
            setEmailFieldError("Server error. Please try again later.")
          } finally {
            emailInputRef.current.value = "";
            setLoadingSubscribe(false);
          }
        }
    


    if(subscribeSuccess)return <div className={styles.mainDiv}>

<div className={styles.subscribedDiv}>

<h1 className={styles.title}>You've successfully subscribed</h1>

<p className={styles.instruction}>Welcome to our email list. You can expect emails containing discounts and special updates.</p>

</div>


    </div>




return <div className={styles.mainDiv}>

<div className={styles.subscribedDiv}>
  <h1 className={styles.title}>Newsletter subscribe</h1>
  <p className={styles.instruction}>Your privacy is important. We will never share your email or information with anyone.</p>

<div className={styles.emailInputWrapper}>
    <input ref={emailInputRef} className={styles.emailInput}
    onChange={()=>{setEmailFieldError(false)}}
       
       autoComplete="email"
       placeholder=' '
    />

    <label className={styles.label}>Email</label>

   
</div>

{emailFieldError && <span className={styles.emailError}><ErrorIcon/>{emailFieldError}</span>}
    
  <button onClick={handleSubscribe} className={`mainButton ${styles.subscribeButton}`}>Subscribe</button>
</div>

</div>


}
