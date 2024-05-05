import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./cartitem.module.css";

import classNames from "classnames";

import AppContext from "@/contexts/AppContext";

const CartItem = ({ item }) => {
  const { cartProducts, setCartProducts } = useContext(AppContext);

  console.log('it', item)

  const handleUpdateCartQty = (quantity) => {
    setCartProducts(
      cartProducts
        .map((cp) => {
          if (cp.id === item.id && cp.variant === item.variant) {
            cp.quantity += quantity;
            return cp.quantity !== 0 ? cp : null;
          }
          return cp;
        })
        .filter(Boolean),
    );
  };

  const handleRemoveFromCart =  (lineItemId, lineItemVariant) => {
    const newCartProducts = cartProducts.filter((cp) => cp.id != lineItemId || cp.variant != lineItemVariant);
    console.log(lineItemId);
    console.log(newCartProducts);
    setCartProducts(newCartProducts);
  };

  return (
    <div className={styles.mainItemDiv}>
      
      <Link className={styles.mediaLink} href={`/products/${item.name.toLowerCase().replace(/\s+/g, "-")}`} >
       
          <Image
            src={`/images/${item.image}`}
            alt={item.name}
            className={styles.media}
            height={0} width={0} sizes="72px"
          />
       
      </Link>
     
      <div className={styles.mainItemInfo}>
        <Link className={styles.link} href={`/products/${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <span className={styles.productName}>{item.name}</span>
        </Link>
       
     
        <p className={styles.itemPrice}>${item.price}</p>
        {item.variant && <p className={styles.variant}>{`Color: ${item.variant}`}</p>}



        
          <div className={styles.buttons}>
            <button
              className={styles.quantityButton}
              onClick={() => handleUpdateCartQty(-1)}
            >
              -
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => handleUpdateCartQty(1)}
            >
              +
            </button>
          </div>
        
           
        

       
      </div>
      <div className={styles.edgeDiv}>

      <Image
          src='/images/bin.png'
            className={styles.removeButton}
            onClick={() => handleRemoveFromCart(item.id, item.variant)}
            height={0} width={0}
            sizes="48px"
          />


      <h2 className={styles.totalPrice}>${(item.quantity*item.price).toFixed(2)}</h2>
     
      </div>
    </div>
  );
};

export default CartItem;
