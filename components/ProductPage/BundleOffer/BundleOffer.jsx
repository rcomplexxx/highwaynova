
import { useEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({quantity, setQuantity, price, stickerPrice, bundle}) {

  

  




  // if(bundleInfo.length === 0) return <></>


  return (
    <div className={styles.mainDiv}>

        
<div className={styles.BuyAndSaveWrapper}>
<div className={styles.borderLineDiv} />
<span className={styles.buyAndSaveTxt}>Buy More & Save Money</span>
<div className={styles.borderLineDiv} />
</div>






    <BundleOption isSelected={quantity<bundle[0].quantity} originalPrice={stickerPrice?stickerPrice:price} discountPercentage={stickerPrice?100*(1-(price/stickerPrice)):0} bundleQuantity={1}
    setQuantity={setQuantity}/>
  

      {bundle.map((b, index)=>{

        
    return <BundleOption key = {index} isSelected={quantity>=b.quantity && (index===bundle.length-1 || quantity<bundle[index+1].quantity)} originalPrice={price* b.quantity} discountPercentage={b.discountPercentage} bundleQuantity={b.quantity}
    setQuantity={setQuantity}
    
    />

      })}
      

   

    </div>
  )
}
