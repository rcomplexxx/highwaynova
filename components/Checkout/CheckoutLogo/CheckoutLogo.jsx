import Link from "next/link";
import styles from "./checkoutlogo.module.css";
import Image from "next/image";
import { CartIcon } from "@/public/images/svgs/svgImages";

export default function CheckoutLogo() {
  return (
    <div className={styles.logoWrapper}>
    <div className={styles.logoDiv}>
      <Link href='/cart' className={styles.cartLink}>
             
<CartIcon styleClassName={styles.bagImg}/>

      </Link>

      <Link href='/'>
      <Image className={styles.logo} src="/images/lightbook11.png" alt={`logo`} height={0} width={0} sizes={'128px'}/>
      </Link>

    
    </div>
    </div>
  );
}


