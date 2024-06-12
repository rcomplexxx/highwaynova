import Image from "next/image";
import styles from "./picwiththumbnail.module.css";
import { useEffect, useState } from "react";

export default function PicWithThumbnail({ product }) {
  const [images, setImages] = useState(false);
  
  
  

  useEffect(() => {



    if (product.images.length > 1 ) {


      const thumbIndexes = product.thumbnails ? product.thumbnails : [0, 1];
      const myImages = [];
      const productImagesLength = product.images.length;


      if (productImagesLength > thumbIndexes[0])
        myImages.push(product.images[thumbIndexes[0]]);

      else myImages.push(product.images[0]);



      if (productImagesLength > thumbIndexes[1])
        myImages.push(product.images[thumbIndexes[1]]);

      else myImages.push(product.images[productImagesLength-1]);



      setImages(myImages);


    } else {
      setImages([product.images[0]]);
    }

   
    
    

   
  
    
  }, []);




  return (
    <>
      <Image
        height={0}
        width={0}
        src={`/images/` + images[0]} // Path to your image from the `public` directory
        alt="Product Image"
        className={`${styles.productImage} ${styles.productImage1} ${
          images.length > 1
            ? styles.doubleImgMain
            : styles.singleImgMain
        }`}
        sizes="(max-width: 480px) 90vw,(max-width: 600px) 80vw, (max-width: 900px) 45vw, 25vw"
        priority={true}
       
        
      />
      {images.length > 1 && (
        <Image
          height={0}
          width={0}
          src={`/images/` + images[1]} // Path to your image from the `public` directory
          alt="Thumbnail"
          className={`${styles.productImage} ${styles.doubleImgSecond}`}
          sizes="(max-width: 480px) 90vw,(max-width: 600px) 80vw, (max-width: 900px) 45vw, 25vw"
        />
      )}
      {product.stickerPrice && <div className={styles.sale}>Sale</div>}
    </>
  );
}
