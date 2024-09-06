
import Link from "next/link";
import Image from "next/image";
import styles from "./cartitem.module.css";



import { useGlobalStore } from "@/contexts/AppContext";
import { BinIcon } from "@/public/images/svgs/svgImages";

const CartItem = ({ item }) => {


  


  

  
  const { cartProducts, setCartProducts } = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
  }));

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
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart =  () => {
    
    const newCartProducts = cartProducts.filter((cp) => cp.id !== item.id || cp.variant !== item.variant);
  
    
    setCartProducts(newCartProducts);
  };

  return (
    <div className={styles.mainItemDiv}>
      
      <Link className={styles.mediaLink} href={`/products/${item.name.toLowerCase().replace(/\s+/g, "-")}${item.variant? '?variant='+item.variant: ''}`} >
       
          <Image
            src={`/images/${item.image}`}
            alt={item.name}
            className={styles.productImage}
            height={0} width={0} sizes="72px"
          />
       
      </Link>
     
      <div className={styles.mainItemInfo}>
        <Link className={styles.productName} href={`/products/${item.name.toLowerCase().replace(/\s+/g, "-")}${item.variant? '?variant='+item.variant: ''}`}>
      {item.name}
        </Link>
       
       <div className={styles.priceDiv}>
        <span className={styles.itemPrice}>${item.price}</span>
        {item.stickerPrice && <span className={`${styles.itemPrice} ${item.stickerPrice && styles.itemPriceCrossed}`}>${item.stickerPrice}</span>}
        </div>



        {item.variant && <span className={styles.variant}>{`Color: ${item.variant}`}</span>}
       


        
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
        

      <BinIcon styleClassName={styles.removeButton} handleClick={handleRemoveFromCart}/>



      <h2 className={styles.totalPrice}>${(item.quantity*item.price).toFixed(2)}</h2>
     
      </div>
    </div>
  );
};

export default CartItem;
