
import { useEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({ price, stickerPrice, bundle, quantity, setQuantity, mainVariant, bundleVariants, setBundleVariants}) {

  

  
  useEffect(()=>{

    if(!mainVariant)return;

    if(quantity<bundle[0].quantity || quantity>bundle[bundle.length-1].quantity)setBundleVariants([]);

    
    else if(quantity !== bundleVariants.length){
     

      let newBundleVariants;

      if(bundleVariants.length < quantity){

        newBundleVariants = [...bundleVariants];

        for(let i=0; i<quantity - bundleVariants.length  ; i++) newBundleVariants.push(mainVariant)
      }

      else if(bundleVariants.length > quantity){

        newBundleVariants = bundleVariants.filter((bv, index)=>{
          return index<quantity;
        })

      }

      setBundleVariants(newBundleVariants);
      //Ovde podesiti bundle variants
    }

  },[quantity])




  // if(bundleInfo.length === 0) return <></>


  return (
    <div className={styles.mainDiv}>

        
<div className={styles.BuyAndSaveWrapper}>
<div className={styles.borderLineDiv} />
<span className={styles.buyAndSaveTxt}>Buy More & Save Money</span>
<div className={styles.borderLineDiv} />
</div>






    <BundleOption isSelected={quantity<bundle[0].quantity} originalPrice={stickerPrice?stickerPrice:price} discountPercentage={stickerPrice?100*(1-(price/stickerPrice)):0} bundleQuantity={1}
    setQuantity={setQuantity} setBundleVariants={setBundleVariants}/>
  

      {bundle.map((b, index)=>{

        
    return <BundleOption key = {index} isSelected={quantity>=b.quantity && (index===bundle.length-1 || quantity<bundle[index+1].quantity)} originalPrice={price* b.quantity} discountPercentage={b.discountPercentage} bundleQuantity={b.quantity}
    setQuantity={setQuantity} bundleVariants={bundleVariants} setBundleVariants={setBundleVariants}
    
    />

      })}
      

   

    </div>
  )
}
