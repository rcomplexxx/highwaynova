import { useEffect, useRef, useState } from 'react'
import styles from './emailflowpopup.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';




export default function EmailFlowPopup({setEmailPopup}){
    const [error, setError] = useState();
    const [successfullySignedUp, setSuccessfullySugnedUp] = useState(false);

    const emailFieldRef = useRef();
    const router = useRouter();

    useEffect(()=>{
        
        localStorage.setItem("popupShown", true);
    },[])


    useEffect(() => {

   
    

       
  
        const handlePopState = (event)=>{
          history.go(1);
          setEmailPopup(false);

        }
  
  
   
          router.beforePopState((state) => {
            state.options.scroll = false;
            return true;
          });
          
  
       
  
       
         
  
          window?.addEventListener("popstate", handlePopState);
        
       
    
        return () => {
       
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
              type: "subscribers",
              email: emailFieldRef.current.value,
              source: "popUp15%"
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
        return <> <span>DO YOU WANT 15% OFF?</span> 
        <span>SIGN UP BELOW!</span> 
        <div className={styles.provideEmailDiv}>
          <input ref={emailFieldRef} onChange={()=>{setError()}} className={styles.emailField}/>
          <button className={styles.sendEmailButton}
          onClick={handleSignUp}>Sign up</button>
           </div>
           {error && <span className={styles.emailError}>{error}</span>}
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
        <div className={styles.popupBackground}></div>
         <div className={styles.popupWrapper}>
            <div onClick={()=>{setEmailPopup(false)}} className={styles.cancelButton}>
                <Image src='/images/cancelWhite.png' height={8} width={8}/>
            </div>
               { !successfullySignedUp ?popupRequestContent():thankYouContent()}
           
         </div>
    </div>
}



//WANT EXCLUSIVE OFFERS?