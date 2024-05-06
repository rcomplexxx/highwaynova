import Image from "next/image";
import DropCard from "./DropCard/DropCard";
import styles from "./productPageCards.module.css";
import { useRef, useState } from "react";
import { ErrorIcon } from "@/public/images/svgs/svgImages";

export default function ProductPageCards() {
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
        if(email.length==0)emailError='This field is required.'
        else emailError='Please enter a valid email.'
      
        }

        if(name.length==0){
          nameError='This field is required.'
        }

      if (message.match(/ /g) < 2) {
       if(message.length==0) messageError='This field is required.'
        else if (message.match(/ /g) < 2) messageError='Please enter at least three words.'
      }

      if(nameError || emailError || messageError){
        setContactErrors({name:nameError, email: emailError, message: messageError});
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
    <>
  
      <DropCard dropCardId={'2'} title="Shipping & Returns">
        <div className={styles.descriptionDiv}>
          <p>
            THIS PRODUCT SHIPS FREE TO CONTINENTAL USA. A SAVINGS OF OVER $75!
          </p>

          <p>
            Please Note: There is no restocking fee for this item. However,
            customers interested in a return for a refund must pay for the
            return shipping costs.
          </p>
        </div>
      </DropCard>
      <DropCard dropCardId={'3'} title="Ask a question"  contactCard={true}>
    


      
      <div className={styles.mainContactDiv}>
        
        

        <p className={styles.getInTouch}>Please note, we will respond to you by email within 24-48 hours. Please include as much details as possible to help us understand your requirements.</p>
        <div className={styles.contactInfoDiv}>
          
          
            <div className={`${styles.inputGroup} ${contactErrors.name && styles.inputGroupErrorMargin}`}>
             
              <input
                id="name"
                placeholder=" "
                ref={nameRef}
                className={styles.contactInput}
                onChange={()=>{ setContactErrors({...contactErrors, name: false})}}
              />
               <label htmlFor="name" className={styles.inputGroupLabel}>Name</label>
               </div>
               {contactErrors.name && <span className={styles.contactError}><ErrorIcon/>{contactErrors.name}</span>}
          
            <div className={`${styles.inputGroup} ${contactErrors.email && styles.inputGroupErrorMargin}`}>
             
              <input
              placeholder=" "
                id="email"
                ref={emailRef}
                className={styles.contactInput}
                onChange={()=>{ setContactErrors({...contactErrors, email: false})}}
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
            maxLength={500}
          />
          <label className={styles.messageText}>Question</label>
        </div>
        {contactErrors.message && <span className={`${styles.contactError} ${styles.contactMessageError}`}><ErrorIcon/>{contactErrors.message}</span>}
          
          {messageSent && <span className={styles.messageSuccess}>Question sent successfully.</span>}
       
        <button onClick={handleSubmit} className={`${styles.sendButton} ${(messageLoading || messageSent) && styles.sendButtonDisabled}`}>
          Send
        </button>
      </div>
      
      </DropCard>

      <div className={styles.trustIcons}>
        <div className={styles.trustIcon}>
          <Image height={0} width={0} sizes="48px" loading={'lazy'} className={styles.trustIconImage} alt='Free shipping' src='/images/truckIcon8.svg' />
          <span>Free shipping</span>
        </div>
        <div className={styles.trustIcon}>
          <Image height={0} width={0} sizes="48px" loading={'lazy'} className={styles.trustIconImage} alt='Free return' src='/images/packageReturn4.png'/>
          <span>Free returns</span>
        </div>
        <div className={styles.trustIcon}>
          <Image height={0} width={0} sizes="48px" loading={'lazy'} className={styles.trustIconImage} alt='Guarantee' src='/images/guarantee4.png'/>
          <span>30 Days money back guarantee</span>
        </div>
      </div>
    </>
  );
}
