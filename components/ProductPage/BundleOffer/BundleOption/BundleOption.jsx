
import styles from './bundleoption.module.css'


export default function BundleOption({originalPrice, discount, quantity}) {

    const offerPrice = (mainPrice/discount*100).toFixed(2);

    

  return (
    <div className={styles.bundleOption}>
    <div className={styles.presentOption}>
    Buy {quantity} get {discPercentage}% off
    </div>

    <div className={styles.offerCalculations}>

        <div>{offerPrice}</div>
        <div>{originalPrice}</div>
    </div>
    
    </div>
  )
}
