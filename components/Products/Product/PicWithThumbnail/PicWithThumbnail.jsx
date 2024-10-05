import Image from "next/image";
import styles from "./picwiththumbnail.module.css";
import { useMemo } from "react";

export default function PicWithThumbnail({ product, variantImage }) {



  const thumbnailImages = useMemo(() => {
    const { images, thumbnails } = product;
    const thumbIndexes = thumbnails || [0, 1];
  
    if (images.length > 1) {
      const image1 = variantImage || images[thumbIndexes[0]] || images[0];
      const image2 = images[thumbIndexes[1]] || images[1];
  
      return image1 === image2 ? [image1] : [image1, image2];
    }
  
    return [images[0]];
  }, [product.images, variantImage]);


  
  





  return (
    <>
      {thumbnailImages?.map((image, index) => (
        <Image
          key={index}
          height={0}
          width={0}
          src={`/images/${image}`} // Path to your image from the `public` directory
          alt={index === 0 ? "Product Image" : "Thumbnail"}

          className={`${styles.productImage} ${index === 0 ? (thumbnailImages.length === 1?styles.singImgMain:styles.mainImage ) : styles.secondaryImage}`}

          sizes="(max-width: 480px) 90vw, (max-width: 600px) 80vw, (max-width: 900px) 45vw, 25vw"
          priority={index === 0}
        />
      ))}
      {product.stickerPrice && <div className={styles.sale}>Sale</div>}
    </>
  );
}
