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
        <h1 className={styles.title}>Thank you</h1>
        <div className={styles.correctDiv}>
          <Image
            className={styles.correctImg}
            src="/images/correct.png"
            alt="Thanks"
            height={40}
            width={40}
          />
        </div>
      </div>
      <p className={styles.mainPharagraph}>Thank you for shopping with us! Your order has been palced. Check your email for order details. {bonusMessage}</p>
      <Link href='/' className={styles.continue}>Back to home</Link>
    </div>
    </div>
  );
}
