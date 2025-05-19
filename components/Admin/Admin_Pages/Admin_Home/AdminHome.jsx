import Image from "next/image";
import styles from "./adminhome.module.css";
import AdminStatistics from "./AdminStatistics/AdminStatistics";
import { adminAlert } from "@/utils/utils-client/utils-admin/adminAlert";

export default function AdminHome() {
  return (
    <div className={styles.adminHomeMainDiv}>
      <div className={styles.titleDiv}>
        <h1>Hi Boss!</h1>

        <div className={styles.adminHeroImageDiv}>
          <Image src="/images/hackerLight2Modern2.png" alt='Hi Boss!' fill />
        </div>
      </div>
      <div className={styles.borderLine}></div>
      <AdminStatistics/>


      <div className={styles.coolImagesFlexbox}>

      <div className={`${styles.guardianWrapper} ${styles.coolImageWrapper}`}>
          <Image src="/images/matrix4.png" alt='Hello mr. Boss.' 
height={0} width={0} sizes="100vw" />
  </div>

<div className={`${styles.hackermanWrapper} ${styles.coolImageWrapper}`}>
          <Image src="/images/hackerman3.png" alt='Hello mr. Boss.' 
  onClick={()=>{adminAlert('info', 'Welcome Boss.', `Time to make our presence known to the market will come soon. Until then, let's grind.`);}}
  height={0} width={0}  sizes="100vw" />
  </div>

  <div className={`${styles.guardianWrapper} ${styles.coolImageWrapper}`}>
          <Image src="/images/matrix4.png" alt='Hello mr. Boss.' 
height={0} width={0} sizes="100vw" />
  </div>

  </div>


  <div className={styles.coolImagesFlexbox}>



<div className={styles.coolImageWrapper}>
    <Image src="/images/matrix2.png" alt='Hello mr. Boss.' 
height={0} width={0} sizes="100vw" />
</div>





</div>


       
    </div>
  );
}
