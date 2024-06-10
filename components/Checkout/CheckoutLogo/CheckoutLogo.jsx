import Link from "next/link";
import styles from "./checkoutlogo.module.css";
import Image from "next/image";

export default function CheckoutLogo() {
  return (
    <div className={styles.logoWrapper}>
    <div className={styles.logoDiv}>
      <Link href='/cart' className={styles.cartLink}>
      <Image
                  height={0}
                  width={0}
                  sizes="48px"
                  src="/images/bag.png"
                  className={styles.bagImg}
                  alt="cart"
                />

      </Link>
      <Link href='/'>
      <Image className={styles.logo} src="/images/lightbook10.png" height={0} width={0} sizes={'128px'}/>
      </Link>

    
    </div>
    </div>
  );
}


