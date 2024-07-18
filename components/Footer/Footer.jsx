import { useState,  useCallback } from "react";
import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";
import LinkCard from "./LinkCard/LinkCard";
import collections from "@/data/collections.json";
import { Amex,Discover, ErrorIcon, GPay, Jcb, MasterCard, PaypalWhite, UntionPay, Visa } from "@/public/images/svgs/svgImages";


export default function Footer() {
 
  const [error, setError] = useState();
  const [successful, setSuccessful] = useState(false);
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  const handleSubscribe = useCallback(async () => {


    if(loadingSubscribe) return;

    const email= document.getElementById('subscribe');
    const emailPattern = /^\w+@\w+\.\w+$/;
    if (!emailPattern.test(email.value)) {
      setError("Please enter a valid email address.");
      return;
    } else {


      setLoadingSubscribe(true);

      try {
        const response = await fetch("/api/sqlliteapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "customers",
            email: email.value,
            source: "footer",
          }),
        });
    
        if (response.ok) {
          setSuccessful(true);
          setError();
        } else {
          setError("Server error");
        }
      } catch (error) {
        setError("Server error");
      } finally {
        email.value = "";
        setLoadingSubscribe(false);
      }
    }
  });


  return (
    <footer className={styles.footer}>
      <div className={styles.mainDiv}>
        

      
        <div className={styles.linkCards}>




        <LinkCard title={"Policies"}>
     <div className={styles.footerLinks}>

         
     <Link href="/privacy-policy" className={styles.footerLink}>
           Privacy Policy
         </Link>
         <Link href="/shipping-policy" className={styles.footerLink}>
           Shipping Policy
         </Link>
         <Link href="/refund-policy" className={styles.footerLink}>
           Refund Policy
         </Link>
         <Link href="/terms-of-service" className={styles.footerLink}>
           Terms of service
         </Link>
       
          </div>

      </LinkCard>
       
    

      <LinkCard title={"Explore"}>
      <div className={styles.footerLinks}>
      {collections.map((c,index)=>{
        return <Link key={index} href={`/collection/${c.name.toLowerCase().replace(/ /g, '-')+'/page/1'}`} className={styles.footerLink}>
       {c.name}
      </Link>
      })}
      </div>
        </LinkCard>



   

      <LinkCard title={"Stay connected"}>
          <div className={`${styles.footerLinks} ${styles.connectdiv}`}>
        <span className={styles.subscribePharagraph}>
          Sign up for discounts & special updates
        </span>
        <div className={styles.subscribeWrapper}>
        <input
          id="subscribe"
          autoComplete="email"
          className={styles.subscribeInput}
          placeholder="Enter your email address"
          maxLength={127}

          onKeyDown={(e)=>{
            if(e.key === "Enter")
              handleSubscribe();

          }}

          onChange={() => {
            if (error) setError();
            if (successful) setSuccessful(false);
          }}
        />
 <button className={`${styles.subscribeButton} accentButton ${loadingSubscribe && styles.loadingSubscribe}`} onClick={handleSubscribe}>
          Subscribe
        </button>
        </div>
        {error && <p className={styles.subscribeValidationMessage}><ErrorIcon/>{error}</p>}
        {successful && !error && (
          <p
            className={`${styles.subscribeValidationMessage} ${styles.subscribeSuccess}`}
          >
            Successfuly subscribed.
          </p>
        )}
       
        </div>
          </LinkCard>

          <LinkCard title={"Get in touch"}>
     <span className={styles.getInTouch}>
         
     To get in touch with our helpful Customer Service team, please <Link aria-label="Contact customer service" href='/contact-us'>click here</Link>. They will respond to all your questions and enquiries ASAP.
       </span>
      </LinkCard>


     </div>
        
        <div  className={styles.paymentsDivWrapper}>
        <div  className={styles.paymentsDiv}>
      
           <Visa styleClassName={styles.payments}/>
            <MasterCard styleClassName={styles.payments}/>
           <Amex styleClassName={styles.payments}/>
           
          <Discover styleClassName={styles.payments}/>
            <Jcb styleClassName={styles.payments}/>
            <UntionPay styleClassName={styles.payments}/>
            <PaypalWhite styleClassName={styles.payments}/>
            <GPay styleClassName={styles.payments}/>
        </div>
        </div>
        <span className={styles.reservedRightsPharagraph}>
          © 2024, Lightbook All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
