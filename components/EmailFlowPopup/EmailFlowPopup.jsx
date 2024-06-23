import { useEffect, useRef, useState } from 'react'
import styles from './emailflowpopup.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CancelIcon, ErrorIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';




export default function EmailFlowPopup({setEmailPopup}){
    const [error, setError] = useState();
    const [successfullySignedUp, setSuccessfullySugnedUp] = useState(false);

    const emailFieldRef = useRef();
    const router = useRouter();
   

  
    
    const { changeEmailPopupOn } = useGlobalStore((state) => ({
      changeEmailPopupOn: state.changeEmailPopupOn,
    }));




    useEffect(() => {



   
      changeEmailPopupOn();
      

        const handlePopState = ()=>{
          
          setEmailPopup(false);
          window?.removeEventListener("popstate", handlePopState);
        }

        window?.addEventListener("popstate", handlePopState);
        
  
       
   
       
  
       
         window.history.pushState(null, null, router.asPath);
        history.go(1);
  
        


        return () => {

          console.log('hello from email flow popup')
         
          changeEmailPopupOn();
      
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
          

          <input ref={emailFieldRef} placeholder='Enter email here' 
          onKeyDown={(e)=>{
   
              if (e.key === 'Enter') {
                handleSignUp();
              }
           
          }}
          onChange={()=>{setError()}} className={styles.emailField} maxLength={127}/>
          {error && <span className={styles.emailError}><ErrorIcon/>{error}</span>}
          
         
          <button className={styles.sendEmailButton} onClick={handleSignUp}>Sign up</button>
           </div>
        
           </>
      }

      const thankYouContent=()=>{
        return <>
        {/* <span className={styles.thankYouTitle}>Welcome!</span>
        <span className={styles.thankYouMessage}>You have successfully subscribed! Ps. check your email for discount.</span>
       
        <button onClick={()=>{history.back();  }} className={styles.sendEmailButton}>Continue shopping</button> */}

        <span className={styles.thankYouMessage2}>Thank you for signing up!</span>
     
        </>
      }


    return <div className={styles.popupMainWrapper}>
         <div className={styles.popupWrapper}>

      <Image src ="/images/emailPopupBg3.jpeg" className={styles.emailPopupBg} height={0} width={0} sizes='(max-width: 428px) calc(100vw - 32px), 384px' loading='eager' priority={true}/>
    


              <CancelIcon handleClick={()=>{history.back()}} color={"var(--email-cancel-icon-color)"} styleClassName={styles.cancelIcon}/>

        
           
               { !successfullySignedUp ?popupRequestContent():thankYouContent()}


               
               
           
         </div>
    </div>
}



//WANT EXCLUSIVE OFFERS?