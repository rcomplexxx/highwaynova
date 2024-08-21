
import { useEffect, useState } from 'react';
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'
import bundles from '@/data/bundles.json'

export default function BundleOffer({productId, price, stickerPrice}) {

  const [bundleInfo, setBundleInfo] = useState([]);

  useEffect(()=>{

    const bundle = bundles.find((b) => {
      return b.productId==productId;
    });

    console.log('here is bundle', bundle)
    console.log('here is sticker', stickerPrice)

    if(!bundle) return ;


    const newBundleInfo= [];

    newBundleInfo.push({quantity: 1, price: price, discountPercentage: stickerPrice?price*100/stickerPrice:0})

    bundle.offers.forEach(o => {

      newBundleInfo.push({quantity: o.quantity, price: price* o.quantity, discountPercentage: o.discountPercentage})

    });

    setBundleInfo(newBundleInfo);

  }, [])




  // if(bundleInfo.length === 0) return <></>


  return (
    <div className={styles.mainDiv}>
  

      {bundleInfo.map((b, index)=>{

        
    return <BundleOption key = {index} originalPrice={b.price} discountPercentage={b.discountPercentage} quantity={b.quantity}/>

      })}
      

   

    </div>
  )
}
