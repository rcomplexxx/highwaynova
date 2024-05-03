import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import styles from "./product.module.css";
import PicWithThumbnail from "./PicWithThumbnail/PicWithThumbnail";
import { STARPATH } from "@/data/constants";

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
/> {product.reviewNumber} reviews</div>
        <div className={`${styles.cardContentText} ${styles.cardContentPrice}`}>
          {product.stickerPrice && (
            <span className={styles.stickerPrice}>${product.stickerPrice.toFixed(2)}</span>
          )}{" "}
          ${product.price.toFixed(2)}
        </div>
     
      </div>
    </div>
  );
};

export default Product;
