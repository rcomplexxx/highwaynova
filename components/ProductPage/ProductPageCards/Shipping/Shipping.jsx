import Link from 'next/link'
import styles from './shipping.module.css'




export default function Shipping() {
  return (


  <>
   
   <div className={styles.mainSpan}>Free Shipping</div>
  

    <div className={styles.gridTable}>
        <div className={styles.rowDiv}>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Region</span>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Free shipping</span>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Estimated delivery Time</span>
    </div>

    <div className={styles.rowDiv}>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>United States</span>
    <span className={styles.firstRowSpan}>✓</span>
    <span className={styles.firstRowSpan}>7 - 20 days</span>
    </div>
    <div className={styles.rowDiv}>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Canada</span>
    <span className={styles.firstRowSpan}>✓</span>
    <span className={styles.firstRowSpan}>7 - 20 days</span>
    </div>
 
 
    <div className={`${styles.rowDiv} ${styles.lastRowDiv}`}>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Australia</span>
    <span className={styles.firstRowSpan}>✓</span>
    <span className={styles.firstRowSpan}>7 - 20 days</span>
    </div>



  </div>

<div className={styles.shippingDiv}>
  <div>
  Processing time 1 - 5 days.
  Any items not received within 8 weeks qualify for our full refund or reship guarantee 🌟
    </div>

    <div>
    Please <Link href='/contact-us'>contact us</Link> with any further questions and our support team will be happy to help.
    </div>


  </div>

  </>
  )
}
