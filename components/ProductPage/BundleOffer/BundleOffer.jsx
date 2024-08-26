
import { useEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({price, stickerPrice, bundle}) {






  // if(bundleInfo.length === 0) return <></>


  return (
    <div className={styles.mainDiv}>


    <BundleOption originalPrice={stickerPrice?stickerPrice:price} discountPercentage={stickerPrice?100*(1-(price/stickerPrice)):0} quantity={1}/>
  

      {bundle.map((b, index)=>{

        
    return <BundleOption key = {index} originalPrice={price* b.quantity} discountPercentage={b.discountPercentage} quantity={b.quantity}/>

      })}
      

   

    </div>
  )
}
