
import styles from './bundleoption.module.css';



export default function BundleOption({isSelected, originalPrice, discountPercentage, bundleQuantity, setQuantity, localBundleVariants, setLocalBundleVariants, allVariants }) {


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
      <div className={styles.bundleQuantityDiv}>Buy {bundleQuantity}</div>
      {discountPercentage!==0 &&  <div className={styles.origPrice}>${originalPrice}</div>}
   
      
    </div>


    <div className={styles.bundleSave}>

    <div className={styles.saveDiv}>{bundleQuantity===1?'Standard price':`You save ${discountPercentage}%`}</div>
    <div className={styles.offerPrice}>${originalPrice - parseFloat((originalPrice*discountPercentage/100).toFixed(2))}</div>
    </div>

    </div>


    
    </div>


{isSelected && localBundleVariants && 
    <div className={styles.variantsDiv}>
      <span className={styles.variantLabel}>Select variants</span>
   

{localBundleVariants.map((bv,index)=>{
  return <select
id="selectVariants"
className={styles.targetTrafficSelect}
value={bv.name}
onChange={(e)=>{
  const newLocalBundleVariants = [...localBundleVariants];
  newLocalBundleVariants[index]= e.target.value;
  setLocalBundleVariants(newLocalBundleVariants)
}}
>
 {allVariants.map(v=>{
  return <option value={v}>{v}</option>
 })

}


</select>

})}

</div>

}


</div>





  )
}
