import { useRef, useState } from "react";
import styles from "./reviewimage.module.css";
import Image from "next/image";
import { CancelIcon, CorrectIcon } from "@/public/images/svgs/svgImages";
import { adminCopycat } from "@/utils/utils-client/utils-admin/adminCopycat";

export default function ReviewsCard({
  productId,
  imageIndex,
  imageName,
  deleted,
  setImages,
  changed
}) {
  


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
      {!deleted && <CancelIcon handleClick={handleImgCancelClick} color={'var(--admin-error-color)'} styleClassName={styles.cancelImage}/>}
      {/* {deleted && <CorrectIcon handleClick={handleImgCancelClick} color={'var(--admin-success-color)'} styleClassName={`${styles.cancelImage} ${styles.correctImage}`}/>} */}
    <Image
      src={`/images/review_images/productId_${productId}/${imageName}`}
      onClick={()=>{if(deleted)handleImgCancelClick()}}
      height={0} width={0}
      sizes="100vw"
      className={`${styles.reviewImage} ${deleted && styles.deletedImage} ${changed && styles.imageChanged}`}
     
    />
    <button onClick={async(e)=>{   if( await adminCopycat(imageName)) e.target.innerHTML = 'Img name copied!'}}>
  Copy img name</button>

   <span className={styles.validateCode}>...{imageName.match(/(.{4})\./)[1]}{imageName.match(/\.(.*)$/)[0]}</span>
  
  
    </div>
  );
}
