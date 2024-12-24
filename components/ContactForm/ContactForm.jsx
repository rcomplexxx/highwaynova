


import  { useRef, useState } from "react";

import { ErrorIcon } from "@/public/images/svgs/svgImages";
import styles from './contactform.module.css';

export default function ContactForm({messageLabel="Message"}) {

    const [messageLoading, setMessageLoading]= useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [errors, setErrors] = useState({name: false, email: false, message:false});

    const fieldRefs = { name: useRef(), email: useRef(), message: useRef() };

    
    
  
    const handleSubmit = async () => {
      if (messageSent) return;
    
     
      try {

         setMessageLoading(true);

         const {name, email, message} = Object.fromEntries(
          Object.entries(fieldRefs).map(([key, ref]) => [key, ref.current.value])
        );
    
        const errors = {
          name: !name && "This field is required.",
          email: !email
            ? "This field is required."
            : !/^\w+@\w+\.\w+$/.test(email) && "Please enter a valid email.",
          message: !message
            ? "This field is required."
            : (message.match(/ /g) || []).length < 2 &&
              "Please enter at least three words.",
        };
    
        if (Object.values(errors).some(Boolean)) return setErrors(errors);
    
        const response = await fetch("/api/sqlliteapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "message", message: { name, email, message } }),
        });
    
        if (!response.ok) throw new Error(response.statusText);
        console.log("Message sent successfully.");
        setMessageSent(true);
        Object.values(fieldRefs).forEach(ref => (ref.current.value = ""));
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setMessageLoading(false);
      }
    };
  
  





  return    <div className={styles.contactInfoDiv}>


 <InputField inputLabel={'Name'} inputRef={fieldRefs.name} handleSubmit={handleSubmit} error={errors.name}
 setErrors={setErrors}/>  

<InputField inputLabel={'Email'} inputRef={fieldRefs.email} handleSubmit={handleSubmit} error={errors.email}
 setErrors={setErrors}/>  



<div className={styles.messageField}>

<textarea
placeholder=" "
  ref={fieldRefs.message}
  onChange={()=>{setMessageSent(false);
 setErrors({...errors, message: false})
  }}

  className={styles.messageTextArea}
  
  maxLength={900}
  
/>
   <label className={`${styles.messageText}`}>{messageLabel}</label>
{errors.message &&  <span className={`${styles.contactError} ${styles.contactMessageError}`}><ErrorIcon/>{errors.message}</span>}
{messageSent && <span className={styles.messageSuccess}>Message sent successfully.</span>}
</div>



<button onClick={handleSubmit} className={`${styles.sendButton} accentButton ${(messageLoading || messageSent) && styles.sendButtonDisabled}`}>
Send
</button>

</div>


}











function InputField ({inputLabel, inputRef, error, setErrors, handleSubmit}){
  
 

  return   <div className={styles.inputFieldDiv}>
          
  <div className={styles.inputGroup}>
  
    <input
      
      
      placeholder=" "
      ref={inputRef}
      className={styles.contactInput}
      maxLength={127}
      onChange={()=>{
        setErrors((prev) => ({ ...prev, [inputRef.current.id]: false }));
      
      }
      
      }
      onKeyDown={(e)=>{
        if(e.key === "Enter")
          handleSubmit();

      }}
    />
      <label className={styles.inputGroupLabel}>{inputLabel}</label>
     
  </div>
  {error && <span className={styles.contactError}><ErrorIcon/>{error}</span>}
  </div>


}