


import { ArrowDown } from '@/public/images/svgs/svgImages';
import styles from './bundleoption.module.css';



export default function BundleOption({isSelected, price, stickerPrice, discountPercentage, bundleQuantity,  setQuantity, havingPlus, localBundleVariants, setLocalBundleVariants, allVariants }) {


  //Ako bundle popust postoji tj discPer nije 0, onda u tom slucaju se dozvoljava options i select za varijante, gde ce na select da se ubaci odgovarajuca varijanta.
  //na odgovarajuce mesto koje se odredjuje preko ...


  

  return (
    <div className={styles.bundleOptionWrapper}> 
    <div className={styles.bundleOption} onClick={()=>{if(!isSelected)setQuantity(bundleQuantity)}}>


<div className={`${styles.radioExtRing} ${isSelected && styles.extRingSelected}`}>
<div className={`${styles.radioIntRing} ${isSelected && styles.intRingSelected}`}/>
</div>

<div className={styles.bundleInfo}>



    <div className={styles.bundleOffer}>
      <div className={styles.bundleQuantityDiv}>Buy {bundleQuantity}{havingPlus?'+':''}</div>
      {discountPercentage!==0 &&  <div className={styles.origPrice}>${stickerPrice}</div>}
   
      
    </div>


    <div className={styles.bundleSave}>

    <div className={styles.saveDiv}>{bundleQuantity===1?'Standard price':`You save ${discountPercentage}%`}</div>
    <div className={styles.offerPrice}>${price}</div>


   
    </div>

    </div>


    
    </div>


    {isSelected && localBundleVariants?.length > 0 && <> 
    
    <span className={styles.variantOptionsTitle}>Select variants</span>
    <div className={styles.variantsDiv}>
     
   



{localBundleVariants.map((bv,index)=>{



  return <div key={index} className={styles.variantOptionWrapper}>

  <span className={styles.variantLabel}>#{index+1}</span>

  <select
id="selectVariants"

className={styles.variantSelect}
value={bv}
onChange={(e) => {setLocalBundleVariants(localBundleVariants.map((lbv, i) => (i === index ? e.target.value : lbv)));}}

>


 {allVariants.map((variant, i)=>{
  return <option key={i} value={variant}>{variant}</option>
 })

}

</select>

<ArrowDown color={'var(--bundle-variant-option-color)'} styleClassName={styles.arrowDown}/>
</div>


})}




</div>
</>
}


</div>





  )
}
