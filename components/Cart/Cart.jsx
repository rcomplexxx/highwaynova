import  { useLayoutEffect, useState, useCallback } from "react";
import Link from "next/link";

import CartItem from "./CartItem/CartItem";
import styles from "./cart.module.css";

import BestSellers from "@/components/BestSellers/BestSellers";

import { useGlobalStore } from "@/contexts/AppContext";
import { Spinner2 } from "@/public/images/svgs/svgImages";



const Cart = () => {
  const  {cartProducts, cartProductsInitialized}  = useGlobalStore(state => ({cartProducts: state.cartProducts, cartProductsInitialized: state.cartProductsInitialized}))
  const [addressBarUp, setAddressBarUp] = useState(false);
  

  
  const [invisibleDivHeight, setInvisibleDivHeight] = useState();
  const [invisibleDiv2Height, setInvisibleDiv2Height] = useState();
//

const obtainDivHeight = useCallback((node) => {
  setInvisibleDivHeight(node?.getBoundingClientRect().height);
}, []);

const obtainDiv2Height = useCallback((node) => {
  setInvisibleDiv2Height(node?.getBoundingClientRect().height);
}, []);


  useLayoutEffect(()=>{
   
    if(!invisibleDivHeight || !invisibleDiv2Height){return}

    



if (window.innerWidth<980){

  

  if(Math.round(invisibleDivHeight) < Math.round(invisibleDiv2Height))setAddressBarUp(true);

  else setAddressBarUp(false);
}





  },[invisibleDivHeight,invisibleDiv2Height]);



 



  const renderEmptyCart = useCallback(() => {
    return <div className={styles.emptyCartDiv}>
    <span className={styles.emptyCartText}>
    Add your favorite items to your cart.
    </span>
    <Link className={`${styles.shopNow} mainButton`} href="/products">Shop Now</Link>
    </div>
  },[cartProducts]);

  const subtotal = cartProducts
    .reduce((sum, cp) => sum + cp.quantity * cp.price, 0)
    .toFixed(2);

  const renderCart = useCallback(() => {
   return  <>
      <div className={styles.itemsDiv}>
        {cartProducts.map((lineItem, index) => (
          <CartItem key={index} item={lineItem}  />
        ))}
      </div>
      <div className={styles.cardDetails}>
       <span className={styles.subTotalSpan}>Subtotal:<h4 className={styles.subtotalNew}>${subtotal}</h4></span>
        <Link className={`${styles.checkoutButtonNew} mainButton`} href="/checkout">
         Checkout
        </Link>
      </div>
    </>
},[cartProducts]);





 
  return ( <div className={`${styles.containerStyle}`} style={{minHeight:`${addressBarUp?"calc(100svh - var(--navbar-height))":"calc(100vh - var(--navbar-height))"}`}}>

<div className={styles.cartContentWrapper}  style={{minHeight:`${(addressBarUp?"calc(100svh - var(--navbar-height))":"calc(100vh - var(--navbar-height))")}`}}>
 
 
  <div id="invisibleDiv2" ref={obtainDiv2Height} className={`${styles.invisibleDiv2} ${styles.invisibleDiv}`}/>
  <div id="invisibleDiv" ref={obtainDivHeight} className={styles.invisibleDiv}/>
 
 

  
   
  {!cartProductsInitialized?<Spinner2/>:cartProducts.length === 0? <><h1 className={`${styles.title}  ${styles.emptyTitle}`}>Your cart is empty!</h1>
 {renderEmptyCart()}
  </>:
  <> <h1 className={styles.title}>Your shopping cart</h1>
   
      {renderCart()}
      </>
 
  }

</div>


{cartProductsInitialized && <BestSellers/>}
</div>
  );
};

export default Cart;
