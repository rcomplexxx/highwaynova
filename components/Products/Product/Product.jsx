import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import styles from "./product.module.css";
import PicWithThumbnail from "./PicWithThumbnail/PicWithThumbnail";
import { STARPATH } from "@/public/images/svgs/svgImages";

const Product = ({ product}) => {
  return (
    <div className={styles.root}>
      <Link href={"/products/" + product.name.toLowerCase().replace(/\s+/g, "-")}>
        <div className={styles.media}>
          <PicWithThumbnail product={product} />
        </div>
      </Link>
      <div className={styles.cardContent}>
        <p className={styles.cardContentText}>{product.name}</p>
        <div className={styles.starDiv}>
<StarRatings
rating={product.raiting?product.raiting:4.7}
svgIconPath={STARPATH}
starRatedColor="var(--star-color)"
numberOfStars={5}
starEmptyColor={"var(--star-empty-color)"}
starDimension="20px"
starSpacing="2px"
/> <span className={styles.product_rating_reviews_number}>{product.reviewNumber} reviews</span></div>
<div className={styles.product_price}>
          ${product.price.toFixed(2)}
            {product.stickerPrice && <span className={styles.product_price_span}>${product.stickerPrice.toFixed(2)}</span>}
           
          </div>


     
      </div>
    </div>
  );
};

export default Product;
