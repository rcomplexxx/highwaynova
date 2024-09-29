
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'


export default function BundleOffer({ product, quantity, setQuantity, mainVariant, setBundleVariants}) {

  const [localBundleVariants, setLocalBundleVariants]= useState([]);

  

  
  useLayoutEffect(()=>{

  if (!mainVariant) return;

  if (quantity < product.bundle[0].quantity || quantity > product.bundle.at(-1).quantity) {
    setLocalBundleVariants([]);
  } else {
    setLocalBundleVariants(prev => 
      prev.length > quantity 
        ? prev.slice(0, quantity) 
        : [...prev, ...Array(quantity - prev.length).fill(mainVariant)]
    );
  }

  },[quantity])

  

  
  useEffect(()=>{

    const newBundleVariants = localBundleVariants.reduce((acc, localVariant) => {
      const existing = acc.find(item => item.name === localVariant);
      existing ? existing.quantity++ : acc.push({ name: localVariant, quantity: 1 });
      return acc;
    }, []);
    
    console.log('trenutne local vari', localBundleVariants);
    setBundleVariants(newBundleVariants);

 
    
  },[localBundleVariants])


  // if(bundleInfo.length === 0) return <></>





  





  return (
    <div className={styles.mainDiv}>

        
<div className={styles.BuyAndSaveWrapper}>
<div className={styles.borderLineDiv} />
<span className={styles.buyAndSaveTxt}>Buy More & Save Money</span>
<div className={styles.borderLineDiv} />
</div>






    <BundleOption isSelected={quantity<product.bundle[0].quantity}  quantity={quantity<product.bundle[0].quantity?quantity:1} 
    
    stickerPrice ={((product.stickerPrice * (quantity<product.bundle[0].quantity?quantity:1)).toFixed(2))}

    price = {((product.price * (quantity<product.bundle[0].quantity?quantity:1)).toFixed(2))}


    discountPercentage={product.stickerPrice?100*(1-(product.price/product.stickerPrice)):0} 
    
    bundleQuantity={1} 
    setQuantity={setQuantity} havingPlus={product.bundle[0].quantity>2} setLocalBundleVariants={setLocalBundleVariants}/>
  

      {product.bundle.map((b, index)=>{

        const isSelected = quantity>=b.quantity && (index===product.bundle.length-1 || quantity<product.bundle[index+1].quantity);

        
    return <BundleOption key = {index} isSelected={isSelected} 

    quantity={isSelected?quantity:b.quantity}
   
    


    stickerPrice ={((product.price * (isSelected?quantity:b.quantity)).toFixed(2))}

    price = {(parseFloat((product.price * (100 - b.discountPercentage) / 100).toFixed(2)) * (isSelected?quantity:b.quantity)).toFixed(2)}


    discountPercentage={b.discountPercentage} 
     
    bundleQuantity={b.quantity}
    setQuantity={setQuantity} 
    havingPlus={index===product.bundle.length-1 || product.bundle[index+1].quantity-b.quantity>1}
    localBundleVariants={localBundleVariants} setLocalBundleVariants={setLocalBundleVariants} allVariants={product.variants?.map(v => {return v.name})}
    
    />

      })}
      

   

    </div>
  )
}
