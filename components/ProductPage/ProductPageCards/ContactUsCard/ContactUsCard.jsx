import { useRef, useState } from 'react'
import styles from './contactuscard.module.css'
import { ErrorIcon } from '@/public/images/svgs/svgImages';

export default function ContactUsCard() {



    const [messageLoading, setMessageLoading]= useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [contactErrors, setContactErrors] = useState({name:false, email: false, message:false});
    
    const nameRef = useRef();
    const emailRef = useRef();
    const messageRef = useRef();
    
    const handleSubmit = async () => {
      if(messageSent)return;
      console.log("submite Starter.");
      setMessageLoading(true);
      try {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const message = messageRef.current.value;
  
        let nameError=false;
        let emailError=false;
        let messageError=false;
  
        const emailPattern = /^\w+@\w+\.\w+$/;
        if (!emailPattern.test(email)) {
          if(email.length===0)emailError='This field is required.'
          else emailError='Please enter a valid email.'
        
          }
  
          if(name.length===0){
            nameError='This field is required.'
          }
  
        if (message.match(/ /g) < 2) {
         if(message.length===0) messageError='This field is required.'
          else if (message.match(/ /g) < 2) messageError='Please enter at least three words.'
        }
  
        if(nameError || emailError || messageError){
          setContactErrors({name:nameError, email: emailError, message: messageError});
          return;
        }
  
        const response = await fetch("/api/sqlliteapi", {
          method: "POST",
          body: JSON.stringify({
            type: "message",
            message: { name, email, message },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          console.log("Question sent successfully.");
          // Reset form fields if needed
          setMessageSent(true)
          nameRef.current.value = "";
          emailRef.current.value = "";
          messageRef.current.value = "";
        } else {
          console.error("Error sending question:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending question:", error);
      } finally{setMessageLoading(false);}
    };




  return (
    
    <div className={styles.mainContactDiv}>
        
        <div className={styles.mainSpan}>Ask a question</div>


    <span className={styles.getInTouch}>Please note, we will respond to you by email within 24-48 hours. Please include as much details as possible to help us understand your requirements.</span>
    <div className={styles.contactInfoDiv}>
      
      
        <div className={`${styles.inputGroup} ${contactErrors.name && styles.inputGroupErrorMargin}`}>
         
          <input
            id="name"
            placeholder=" "
            ref={nameRef}
            maxLength={127}
            className={styles.contactInput}
            onChange={()=>{ setContactErrors({...contactErrors, name: false})}}
            onKeyDown={(e)=>{
              if(e.key === "Enter")
                handleSubmit();
  
            }}
          />
           <label htmlFor="name" className={styles.inputGroupLabel}>Name</label>
           </div>
           {contactErrors.name && <span className={styles.contactError}><ErrorIcon/>{contactErrors.name}</span>}
      
        <div className={`${styles.inputGroup} ${contactErrors.email && styles.inputGroupErrorMargin}`}>
         
          <input
          placeholder=" "
            id="email"
            type="email"
            ref={emailRef}
            className={styles.contactInput}
            maxLength={127}
            onChange={()=>{ setContactErrors({...contactErrors, email: false})}}
            onKeyDown={(e)=>{
              if(e.key === "Enter")
                handleSubmit();
  
            }}
          />
           <label className={styles.inputGroupLabel}>Email</label>
          </div>
          {contactErrors.email && <span className={styles.contactError}><ErrorIcon/>{contactErrors.email}</span>}
       
    </div>
    <div className={styles.messageField}>
      
      <textarea
      placeholder=" "
        ref={messageRef}
        onChange={()=>{setMessageSent(false);
         setContactErrors({...contactErrors, message: false})
        }}
        className={styles.messageTextArea}
        rows={6}
        maxLength={900}
      />
      <label className={styles.messageText}>Question</label>
    </div>
    {contactErrors.message && <span className={`${styles.contactError} ${styles.contactMessageError}`}><ErrorIcon/>{contactErrors.message}</span>}
      
      {messageSent && <span className={styles.messageSuccess}>Question sent successfully.</span>}
   
    <button onClick={handleSubmit} className={`${styles.sendButton} accentButton ${(messageLoading || messageSent) && styles.sendButtonDisabled}`}>
      Send
    </button>
  </div>
  )
}
