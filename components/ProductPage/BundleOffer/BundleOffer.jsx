
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({ price, stickerPrice, bundle, quantity, setQuantity, mainVariant, bundleVariants, setBundleVariants, allVariants}) {

  const [localBundleVariants, setLocalBundleVariants]= useState([]);

  

  
  useLayoutEffect(()=>{

    if(!mainVariant)return;

    if(quantity<bundle[0].quantity || quantity>bundle[bundle.length-1].quantity)setLocalBundleVariants([]);

    
    else if(quantity !== localBundleVariants.length){
     

      let newLocalBundleVariants;

      if(localBundleVariants.length < quantity){

        newLocalBundleVariants = [...localBundleVariants];

        for(let i=0; i<quantity - localBundleVariants.length  ; i++) newLocalBundleVariants.push(mainVariant)
      }

      else if(localBundleVariants.length > quantity){

        newLocalBundleVariants = localBundleVariants.filter((bv, index)=>{
          return index<quantity;
        })

      }

      setLocalBundleVariants(newLocalBundleVariants);
     
      
      const newBundleVariants = [];

      console.log('trenutne local vari', newLocalBundleVariants)
      
      for(const localVariant of newLocalBundleVariants){
  
        const newBundleVariantIndex = newBundleVariants.findIndex(nbv => {return nbv.name === localVariant});
  
        if(newBundleVariantIndex !==-1)newBundleVariants[newBundleVariantIndex].quantity+= 1;
        
        else newBundleVariants.push({name: localVariant, quantity: 1});
      }
  
      setBundleVariants(newBundleVariants);



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
    setQuantity={setQuantity} setLocalBundleVariants={setLocalBundleVariants}/>
  

      {bundle.map((b, index)=>{

        
    return <BundleOption key = {index} isSelected={quantity>=b.quantity && (index===bundle.length-1 || quantity<bundle[index+1].quantity)} originalPrice={price* b.quantity} discountPercentage={b.discountPercentage} bundleQuantity={b.quantity}
    setQuantity={setQuantity} localBundleVariants={localBundleVariants} setLocalBundleVariants={setLocalBundleVariants} allVariants={allVariants}
    
    />

      })}
      

   

    </div>
  )
}
