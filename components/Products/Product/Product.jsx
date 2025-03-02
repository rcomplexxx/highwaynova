import Image from "next/image";
import Link from "next/link";
import styles from "./product.module.css";
import PicWithThumbnail from "./PicWithThumbnail/PicWithThumbnail";
import {  Stars } from "@/public/images/svgs/svgImages";

const Product = ({ product}) => {
  return (
    <div className={styles.root}>
      
      <Link href={"/products/" + product.name.toLowerCase().replace(/\s+/g, "-")} className={styles.thumbnailWrapper}>
       
          <PicWithThumbnail product={product} />
        
      </Link>


      <div className={styles.cardContent}>
      <Link href={"/products/" + product.name.toLowerCase().replace(/\s+/g, "-")} className={styles.cardContentText}>
      {product.name}
      </Link>
        <div className={styles.starDiv}>

        <Stars ratingNumber={product.rating?product.rating:4.7} starWrapperClassName={styles.starWrapperClassName} starClassName={styles.starClassName}/>


 <span className={styles.product_rating_reviews_number}>({product.reviewsNumber})</span>
 </div>
 
<div className={styles.product_price}>
          ${product.price.toFixed(2)}
            {product.stickerPrice && <span className={styles.product_price_span}>${product.stickerPrice.toFixed(2)}</span>}
           
          </div>


     
      </div>
    </div>
  );
};

export default Product;
