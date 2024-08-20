import Image from "next/image";
import styles from "../styles/thankyou.module.css";
import  { useEffect } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import { useGlobalStore } from "@/contexts/AppContext";

export default function ThankYou() {

  const {giftDiscount, setCartProducts} = useGlobalStore(state =>  ({
    
    giftDiscount: state.giftDiscount,
    setCartProducts:state.setCartProducts


  }));

  useEffect(() => {
    setCartProducts([]);
  }, []);


  const bonusMessage = giftDiscount?"Ps. We also left you a surprise in there 🎁":"";

  return (
    <div className={styles.thankYouWrapper}>
     <NextSeo {...unimportantPageSeo('/thank-you')}/>
    <div className={styles.mainDiv}>


 


      <div className={styles.titleDiv}>
        <h1 className={styles.title}>Order confirmed!</h1>
       
          <Image
            className={styles.correctImg}
            src="/images/correct.png"
            alt="Thanks"
            height={40}
            width={40}
          />
       
      </div>



      <span className={styles.mainPharagraph}>Thank you for shopping with us. Please check your inbox, as confirmation email is on it's way.</span>
     
   
     
     
      <Link href='/' className={styles.continue}>Return to store</Link>


      <Image
            className={styles.rideon}
            src="/images/rideonmini.jpeg"
            alt="Thanks"
            height={0}
            width={0}
            sizes="100%"
          />

    </div>
    </div>
  );
}
