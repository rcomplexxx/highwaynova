import { useEffect, useRef, useState } from 'react'
import styles from './subscribepopup.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CancelIcon, ErrorIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';




export default function SubscribePopup(){
    const [error, setError] = useState();
    const [emailCaptured, setEmailCaptured] = useState(false);
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    const emailFieldRef = useRef();
    const router = useRouter();
   

  
    
    const { increaseDeepLink, decreaseDeepLink, setEmailPopupOn } = useGlobalStore((state) => ({
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
      setEmailPopupOn: state.setEmailPopupOn,
    }));









    

    useEffect(() => {



        const handlePopState = ()=>{
          
          setEmailPopupOn(false);
          
        }

       
        increaseDeepLink('subscribe_popup');
        window?.addEventListener("popstate", handlePopState);
         
  
        return () => {

          
          window?.removeEventListener("popstate", handlePopState);
          decreaseDeepLink()

        

        };
      }, []);
  




 

      const handleSubscribe = async () => {
        if (subscribeLoading) return;
      
        const email = emailFieldRef.current?.value?.trim();
        if (!/^\w+@\w+\.\w+$/.test(email)) return setError("Please enter a valid email address.");
      
        setSubscribeLoading(true);
        try {
          const response = await fetch("/api/sqlliteapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "subscribe", email, source: "popUp10%" }),
          });
          response.ok ? setEmailCaptured(true) : setError("Server error");
        } catch {
          setError("Server error");
        } finally {
          emailFieldRef.current.value = "";
          setSubscribeLoading(false);
        }
      };

      

      const popupSubscribeContent= ()=>{
        return <> 
        <span className={styles.neutralText}>Sign up and get</span> 
        <span className={styles.calloutText}>10% OFF!</span> 
        <span className={styles.neutralText}>your first order</span> 
        {/* <span>SIGN UP BELOW!</span>  */}
        <div className={styles.provideEmailDiv}>
          

          <input ref={emailFieldRef} placeholder='Enter email here'  autoComplete="email"
          onKeyDown={(event)=>{
   
              if (event.key === 'Enter') {
                handleSubscribe();
              }
           
          }}
          onChange={()=>{setError()}} className={styles.emailField} maxLength={127}/>
          {error && <span className={styles.emailError}><ErrorIcon/>{error}</span>}
          
         
          <button className={`${styles.sendEmailButton} ${subscribeLoading && styles.emailButtonLoading}`} onClick={handleSubscribe}>Sign up</button>
           </div>
        
           </>
      }

      const thankYouContent=()=>{
        return  <span className={styles.thankYouMessage}>Thank you for signing up!</span>
     
       
      }


    return <div className={styles.popupBackDiv}>
         <div className={styles.popupWrapper}>

      <Image src ="/images/emailPopupBg3.jpeg" className={styles.emailPopupCover} height={0} width={0} sizes='(max-width: 428px) calc(100vw - 32px), 384px' loading='eager' priority={true}/>
    


              <CancelIcon handleClick={()=>{router.back()}} color={"var(--email-cancel-icon-color)"} 
              styleClassName={styles.cancelIcon}/>

        
           
               { !emailCaptured ?popupSubscribeContent():thankYouContent()}


               
               
           
         </div>
    </div>
}



//WANT EXCLUSIVE OFFERS?