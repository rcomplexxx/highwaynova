import { useEffect, useRef, useState } from 'react'
import styles from './emailflowpopup.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CancelIcon, ErrorIcon } from '@/public/images/svgs/svgImages';




export default function EmailFlowPopup({setEmailPopup}){
    const [error, setError] = useState();
    const [successfullySignedUp, setSuccessfullySugnedUp] = useState(false);

    const emailFieldRef = useRef();
    const router = useRouter();
    const backPressed = useRef(false);
   


    useEffect(() => {

   
    
       
  
        const handlePopState = (event)=>{
        
          backPressed.current=true;
          setEmailPopup(false);

        }
  
  
   
       
  
       
         window.history.pushState(null, null, router.asPath);
        history.go(1);
  
          window?.addEventListener("popstate", handlePopState);


        return () => {

          console.log('hello from email flow popup')

            if(!backPressed.current)router.back();
            window?.removeEventListener("popstate", handlePopState);

        };
      }, []);
  




 

    const handleSignUp=async () => {
        const emailPattern = /^\w+@\w+\.\w+$/;
        if (!emailPattern.test(emailFieldRef.current.value)) {
          setError("Please enter a valid email address.");
          return;
        } else {
          fetch("/api/sqlliteapi", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "customers",
              email: emailFieldRef.current.value,
              source: "popUp10%"
            }), // Send the form data as JSON
          })
            .then((response) => {
              if (response.ok) {
                setSuccessfullySugnedUp(true);
                setError();
              } else {
                console.log(response);
                setError("Server error");
              }
            })
            .catch((error) => {
                console.log(error);
              setError("Server error");
            })
            .finally(() => {
                emailFieldRef.current.value = "";
            });
        }
      };

      const popupRequestContent= ()=>{
        return <> 
        <span className={styles.signUpText}>Sign up and get</span> 
        <span className={styles.discountText}>10% OFF!</span> 
        <span className={styles.signUpText}>your first order</span> 
        {/* <span>SIGN UP BELOW!</span>  */}
        <div className={styles.provideEmailDiv}>
          <input ref={emailFieldRef} placeholder='Enter email here' onChange={()=>{setError()}} className={styles.emailField} maxLength={127}/>
          <button className={styles.sendEmailButton}
          onClick={handleSignUp}>Sign up</button>
           </div>
           {error && <span className={styles.emailError}><ErrorIcon/>{error}</span>}
           </>
      }

      const thankYouContent=()=>{
        return <>
        <span className={styles.thankYouTitle}>Welcome!</span>
        <span className={styles.thankYouMessage}>You have successfully subscribed!</span>
        <button onClick={()=>{setEmailPopup(false)}} className={styles.sendEmailButton}>Continue shopping</button>
        </>
      }


    return <div className={styles.popupMainWrapper}>
         <div className={styles.popupWrapper}>

         <Image 
          src='/images/emailPopupBg3.jpeg'
          height={0} width={0}
          className={styles.emailPopupBg}
          sizes='100vw'
          priority={true}
          loading={'eager'}
          />

       
<div className={styles.contentWrapperDiv}>
              <CancelIcon handleClick={()=>{history.back()}} color={"var(--email-cancel-icon-color)"} styleClassName={styles.cancelIcon}/>

        
           
               { !successfullySignedUp ?popupRequestContent():thankYouContent()}


               </div>
           
         </div>
    </div>
}



//WANT EXCLUSIVE OFFERS?