
import styles from './bundleoption.module.css'


export default function BundleOption({isSelected, originalPrice, discountPercentage, bundleQuantity, setQuantity }) {


  


    

  return (
    <div className={styles.bundleOption} onClick={()=>{if(!isSelected)setQuantity(bundleQuantity)}}>


<input
    type="radio"
    id="customRadio"
    name="customRadioGroup"
    checked={isSelected}
    className={`${styles.hiddenRadio}`}
  />

<div className={styles.bundleInfo}>



    <div className={styles.bundleOffer}>
      <div className={styles.bundleQuantityDiv}>Buy {bundleQuantity}</div>
      {discountPercentage!==0 &&  <div className={styles.origPrice}>${originalPrice}</div>}
   
      
    </div>


    <div className={styles.bundleSave}>

    <div className={styles.saveDiv}>{bundleQuantity===1?'Standard price':`You save ${discountPercentage}%`}</div>
    <div className={styles.offerPrice}>${originalPrice - parseFloat((originalPrice*discountPercentage/100).toFixed(2))}</div>
    </div>

    </div>
    
    </div>
  )
}
