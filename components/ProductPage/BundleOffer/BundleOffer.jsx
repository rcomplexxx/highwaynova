
import { useEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({quantity, setQuantity, price, stickerPrice, bundle}) {

  
  const [bundleSelected, setBundleSelected] = useState(0);

  useEffect(()=>{

   

    let newBundleSelected = 0;

 
    
    bundle.forEach((b, index) => {
      if(quantity>=b.quantity) newBundleSelected=index+1;
    })

    


    setBundleSelected(newBundleSelected)

  },[quantity])




  // if(bundleInfo.length === 0) return <></>


  return (
    <div className={styles.mainDiv}>

        
<div className={styles.BuyAndSaveWrapper}>
<div className={styles.borderLineDiv} />
<span className={styles.buyAndSaveTxt}>Buy More & Save Money</span>
<div className={styles.borderLineDiv} />
</div>






    <BundleOption isSelected={bundleSelected===0} originalPrice={stickerPrice?stickerPrice:price} discountPercentage={stickerPrice?100*(1-(price/stickerPrice)):0} bundleQuantity={1}
    setQuantity={setQuantity}/>
  

      {bundle.map((b, index)=>{

        
    return <BundleOption key = {index} isSelected={bundleSelected===index+1} originalPrice={price* b.quantity} discountPercentage={b.discountPercentage} bundleQuantity={b.quantity}
    setQuantity={setQuantity}
    
    />

      })}
      

   

    </div>
  )
}
