import { useEffect, useRef, useState } from 'react'
import styles from './subscribepopup.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CancelIcon, ErrorIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';




export default function SubscribePopup(){
    const [error, setError] = useState();
    const [successfullySignedUp, setSuccessfullySugnedUp] = useState(false);
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    const emailFieldRef = useRef();
    const router = useRouter();
   

  
    
    const { increaseDeepLink, decreaseDeepLink, changeEmailPopupOn } = useGlobalStore((state) => ({
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
      changeEmailPopupOn: state.changeEmailPopupOn,
    }));









    

    useEffect(() => {



  
      

        const handlePopState = ()=>{
          
          changeEmailPopupOn();
          window?.removeEventListener("popstate", handlePopState);
        }

       
       
   
       
  
       
        history.pushState(null, null, router.asPath);

         window?.addEventListener("popstate", handlePopState);
         document.documentElement.classList.add("hideScroll");
  
        increaseDeepLink('subscribe_popup')
            


        return () => {

          document.documentElement.classList.remove("hideScroll");
         
          
      
          window?.removeEventListener("popstate", handlePopState);

          decreaseDeepLink()

        

        };
      }, []);
  




 

      const handleSusbscribe = async () => {
        if (subscribeLoading) return;
      
        const email = emailFieldRef.current.value;
        if (!/^\w+@\w+\.\w+$/.test(email)) return setError("Please enter a valid email address.");
      
        setSubscribeLoading(true);
        try {
          const response = await fetch("/api/sqlliteapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "subscribe", email, source: "popUp10%" }),
          });
          response.ok ? setSuccessfullySugnedUp(true) : setError("Server error");
        } catch {
          setError("Server error");
        } finally {
          emailFieldRef.current.value = "";
          setSubscribeLoading(false);
        }
      };

      

      const popupSubscribeContent= ()=>{
        return <> 
        <span className={styles.signUpText}>Sign up and get</span> 
        <span className={styles.discountText}>10% OFF!</span> 
        <span className={styles.signUpText}>your first order</span> 
        {/* <span>SIGN UP BELOW!</span>  */}
        <div className={styles.provideEmailDiv}>
          

          <input ref={emailFieldRef} placeholder='Enter email here'  autoComplete="email"
          onKeyDown={(e)=>{
   
              if (e.key === 'Enter') {
                handleSusbscribe();
              }
           
          }}
          onChange={()=>{setError()}} className={styles.emailField} maxLength={127}/>
          {error && <span className={styles.emailError}><ErrorIcon/>{error}</span>}
          
         
          <button className={`${styles.sendEmailButton} ${subscribeLoading && styles.emailButtonLoading}`} onClick={handleSusbscribe}>Sign up</button>
           </div>
        
           </>
      }

      const thankYouContent=()=>{
        return <>
        {/* <span className={styles.thankYouTitle}>Welcome!</span>
        <span className={styles.thankYouMessage}>You have successfully subscribed! Ps. check your email for discount.</span>
       
        <button onClick={()=>{router.back();  }} className={styles.sendEmailButton}>Continue shopping</button> */}

        <span className={styles.thankYouMessage2}>Thank you for signing up!</span>
     
        </>
      }


    return <div className={styles.popupMainWrapper}>
         <div className={styles.popupWrapper}>

      <Image src ="/images/emailPopupBg3.jpeg" className={styles.emailPopupBg} height={0} width={0} sizes='(max-width: 428px) calc(100vw - 32px), 384px' loading='eager' priority={true}/>
    


              <CancelIcon handleClick={()=>{router.back()}} color={"var(--email-cancel-icon-color)"} styleClassName={styles.cancelIcon}/>

        
           
               { !successfullySignedUp ?popupSubscribeContent():thankYouContent()}


               
               
           
         </div>
    </div>
}



//WANT EXCLUSIVE OFFERS?