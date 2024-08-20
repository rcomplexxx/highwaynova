import styles from './trusticons.module.css'
import {  GuaranteeIcon, PackageReturnIcon, TruckIcon } from "@/public/images/svgs/svgImages";



export default function TrustIcons(){

    return  <div className={styles.trustIcons}>
    <div className={styles.trustIcon}>
      <TruckIcon styleClassName={styles.trustIconImage} />
      <span className={styles.iconText}>Free shipping</span>
    </div>
    <div className={styles.trustIcon}>
     <PackageReturnIcon styleClassName={styles.trustIconImage}/>
     <span className={styles.iconText}>Free returns</span>
    </div>
    <div className={styles.trustIcon}>
      <GuaranteeIcon styleClassName={styles.trustIconImage}/>
      <span className={styles.iconText}>Money back guarantee</span>
    </div>
  </div>

}