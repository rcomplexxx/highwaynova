import Link from "next/link";
import styles from "./navbaronlylogo.module.css";
import Image from "next/image";

export default function NavbarOnlyLogo() {
  return (
    <div className={styles.logoWrapper}>
 
      <Link href='/'>
      <Image className={styles.logo} src="/images/lightbook11.png" alt={`logo`} height={0} width={0} sizes={'128px'}/>
      </Link>

    
  
    </div>
  );
}


