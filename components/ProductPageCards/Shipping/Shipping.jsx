import styles from './shipping.module.css'




export default function Shipping() {
  return (


  <>
   
  

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
    <div className={styles.rowDiv}>
    <span className={`${styles.firstRowSpan} ${styles.header}`}>Europe</span>
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
  <span>
      THIS PRODUCT SHIPS FREE TO CONTINENTAL USA. A SAVINGS OF OVER $75!
    </span>

    <span>
      Please Note: There is no restocking fee for this item. However,
      customers interested in a return for a refund must pay for the
      return shipping costs.
    </span>


  </div>

  </>
  )
}
