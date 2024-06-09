import styles from './shipping.module.css'




export default function Shipping() {
  return (


    <div className={styles.shippingDiv}>
   
  

    <div className={styles.gridTable}>
        <div className={styles.rowDiv}>
    <span className={styles.firstRowSpan}>Region</span>
    <span className={`${styles.firstRowSpan} ${styles.midRowSpan}`}>Free Tracked Shipping</span>
    <span className={`${styles.firstRowSpan} ${styles.lastRowSpan}`}>Estimated Delivery Time</span>
    </div>

    <div className={styles.rowDiv}>
    <span className={styles.firstRowSpan}>UNITED STATES</span>
    <span className={`${styles.firstRowSpan} ${styles.midRowSpan}`}>✓</span>
    <span className={`${styles.firstRowSpan} ${styles.lastRowSpan}`}>7 - 20 days</span>
    </div>
    <div className={styles.rowDiv}>
    <span className={styles.firstRowSpan}>CANADA</span>
    <span className={`${styles.firstRowSpan} ${styles.midRowSpan}`}>✓</span>
    <span className={`${styles.firstRowSpan} ${styles.lastRowSpan}`}>7 - 20 days</span>
    </div>
    <div className={styles.rowDiv}>
    <span className={styles.firstRowSpan}>EUROPE</span>
    <span className={`${styles.firstRowSpan} ${styles.midRowSpan}`}>✓</span>
    <span className={`${styles.firstRowSpan} ${styles.lastRowSpan}`}>7 - 20 days</span>
    </div>
    <div className={styles.rowDiv}>
    <span className={styles.firstRowSpan}>AUSTRALIA</span>
    <span className={`${styles.firstRowSpan} ${styles.midRowSpan}`}>✓</span>
    <span className={`${styles.firstRowSpan} ${styles.lastRowSpan}`}>7 - 20 days</span>
    </div>



  </div>


  <span>
      THIS PRODUCT SHIPS FREE TO CONTINENTAL USA. A SAVINGS OF OVER $75!
    </span>

    <span>
      Please Note: There is no restocking fee for this item. However,
      customers interested in a return for a refund must pay for the
      return shipping costs.
    </span>


  </div>
  )
}
