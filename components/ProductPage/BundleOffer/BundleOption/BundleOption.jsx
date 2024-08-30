
import styles from './bundleoption.module.css'


export default function BundleOption({quantity, originalPrice, discountPercentage }) {

    // const offerPrice = (mainPrice/discount*100).toFixed(2);

    console.log('offer in', quantity, originalPrice, discountPercentage)


    

  return (
    <div className={styles.bundleOption}>

<input type="radio" id="option1" name="ratio" value="1"/>

<div className={styles.bundleInfo}>



    <div className={styles.bundleOffer}>
      <div className={styles.quantityDiv}>Buy {quantity}</div>
      {discountPercentage!==0 &&  <div className={styles.origPrice}>${originalPrice}</div>}
   
      
    </div>


    <div className={styles.bundleSave}>

    <div className={styles.saveDiv}>{quantity===1?'Standard price':`You save ${discountPercentage}%`}</div>
    <div className={styles.offerPrice}>${originalPrice - parseFloat((originalPrice*discountPercentage/100).toFixed(2))}</div>
    </div>

    </div>
    
    </div>
  )
}
