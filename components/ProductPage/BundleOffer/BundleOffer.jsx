
import styles from './bundleoffer.module.css'
import BundleOption from './BundleOption/BundleOption'

export default function BundleOffer({productCost, stickerPrice}) {
  return (
    <div className={styles.mainDiv}>
      

        <BundleOption price={productCost} stickerPrice={productCost*100/stickerPrice} quantity={1}/>
        <BundleOption price={productCost} stickerPrice={stickerPrice * 2} quantity={2}/>
        <BundleOption price={productCost} stickerPrice={stickerPrice} quantity={3}/>

    </div>
  )
}
