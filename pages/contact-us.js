import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";
import  { useRef, useState } from "react";
import Head from "next/head";
import styles from '../styles/contactus.module.css'
import Link from "next/link";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import { NextSeo } from "next-seo";
import { ErrorIcon } from "@/public/images/svgs/svgImages";

export default function ContactUs() {

  const [messageLoading, setMessageLoading]= useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [errors, setErrors] = useState({name: false, email: false, message:false});
  
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
        if(email.length==0)emailError='This field is required.'
        else emailError='Please enter a valid email.'
      
        }

        if(name.length==0){
          nameError='This field is required.'
        }

      if (message.match(/ /g) < 2) {
       if(message.length==0) messageError='This field is required.'
        else  messageError='Please enter at least three words.'
      }

      if(nameError || emailError || messageError){
        setErrors({name:nameError, email: emailError, message: messageError});
        return;
      }

      const response = await fetch("/api/sqlliteapi", {
        method: "POST",
        body: JSON.stringify({
          type: "messages",
          message: { name, email, message },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Message sent successfully.");
        // Reset form fields if needed
        setMessageSent(true)
        nameRef.current.value = "";
        emailRef.current.value = "";
        messageRef.current.value = "";
      } else {
        console.error("Error sending message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally{setMessageLoading(false);}
  };


  return (


    <div className={styles.mainDiv}>
      <NextSeo {...unimportantPageSeo('/contact-us')}/>
        <h1 className={styles.contactUsTitle}>Contact Us</h1>
        <div className={styles.contactUsTextDiv}>

        <span className={`${styles.contactUsText} ${styles.contactUsTextFirst}`}>Before contacting us, check if your question/concern has been answered on our <Link href={'/faq'}>FAQ PAGE</Link>.</span>
        <span className={styles.contactUsText}>We're happy to answer any question/concern you may have. If applicable, please include your <b>order id number</b> (sent by email after purchase).</span>
        <span className={styles.contactUsText}>Please note, we will respond to you by email within 24-48 hours. Please include as much details as possible to help us understand your requirements.</span>
        


        </div>  
          <div className={styles.contactInfoDiv}>
          
              <div className={`${styles.inputGroup} ${errors.name && styles.inputGroupErrorMargin}`}>
              
                <input
                  id="name"
                  placeholder=" "
                  ref={nameRef}
                  className={styles.contactInput}
                  maxLength={127}
                  onChange={()=>{setErrors({...errors, name: false})}}
                />
                  <label className={`${styles.inputGroupLabel} ${errors.name && styles.inputGroupLabelErrorCorrection}`}>Name</label>
                 
              </div>
              {errors.name && <span className={styles.contactError}><ErrorIcon/>{errors.name}</span>}

              <div className={`${styles.inputGroup} ${errors.email && styles.inputGroupErrorMargin}`}>
           
                <input
                placeholder=" "
                id="email"
                ref={emailRef}
                className={styles.contactInput}
                maxLength={127}
                onChange={()=>{setErrors({...errors, email: false})}}
                />
                     <label className={styles.inputGroupLabel}>Email</label>
                
              </div>
              {errors.email && <span className={styles.contactError}><ErrorIcon/>{errors.email}</span>}
          </div>
          <div className={styles.messageField}>
         
            <textarea
            placeholder=" "
              ref={messageRef}
              onChange={()=>{setMessageSent(false);
             setErrors({...errors, message: false})
              }}
              className={styles.messageTextArea}
              
              maxLength={900}
              
            />
               <label className={`${styles.messageText}`}>Message</label>
          {errors.message &&  <span className={`${styles.contactError} ${styles.contactMessageError}`}><ErrorIcon/>{errors.message}</span>}
           {messageSent && <span className={styles.messageSuccess}>Message sent successfully.</span>}
          </div>
          <button onClick={handleSubmit} className={`${styles.sendButton} ${(messageLoading || messageSent) && styles.sendButtonDisabled}`}>
            Send
          </button>
        </div>
     
  );
}
