import { useRef, useState } from "react";
import styles from "./reviewimage.module.css";
import Image from "next/image";
import { CancelIcon, CorrectIcon } from "@/public/images/svgs/svgImages";

export default function ReviewsCard({
  productId,
  imageIndex,
  imageName,
  deleted,
  setImages,
  changed
}) {
  const [imgNameCopied, setImgNameCopied] = useState(false);


  const handleImgCancelClick = () => {
    if(changed)return
    setImages((prev) => {
      let newImages = [...prev];

      newImages = newImages.map((img, index) => {
        if (index == imageIndex) {
          return { imageName: img.imageName, deleted: !img.deleted };
        }
        return img;
      });
      return newImages;
    });
  };


 
  return (
    <div className={styles.imgController}>
      {!deleted && <CancelIcon handleClick={handleImgCancelClick} color={'var(--error-color)'} styleClassName={styles.cancelImage}/>}
      {/* {deleted && <CorrectIcon handleClick={handleImgCancelClick} color={'var(--success-color)'} styleClassName={`${styles.cancelImage} ${styles.correctImage}`}/>} */}
    <Image
      src={`/images/review_images/productId_${productId}/${imageName}`}
      onClick={()=>{if(deleted)handleImgCancelClick()}}
      height={0} width={0}
      sizes="100vw"
      className={`${styles.reviewImage} ${deleted && styles.deletedImage} ${changed && styles.imageChanged}`}
     
    />
    <button onClick={()=>{navigator.clipboard.writeText(imageName);setImgNameCopied(true);}} className={styles.copyImgName}>{imgNameCopied?"Img name copied!":"Copy img name"}</button>
  
  
   <span className={styles.validateCode}>...{imageName.match(/(.{4})\./)[1]}{imageName.match(/\.(.*)$/)[0]}</span>
  
  
    </div>
  );
}
