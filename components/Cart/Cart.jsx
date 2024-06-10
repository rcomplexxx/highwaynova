import  { useLayoutEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";

import CartItem from "./CartItem/CartItem";
import styles from "./cart.module.css";

import BestSellers from "@/components/BestSellers/BestSellers";

import { useGlobalStore } from "@/contexts/AppContext";



const Cart = () => {
  const  cartProducts  = useGlobalStore(state => state.cartProducts)
  const [addressBarUp, setAddressBarUp] = useState(false);
  // const [invDivsPresent, setInvDivsPresent] = useState(true);
  const firstHeightRef = useRef();
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
  firstHeightRef.current= invisibleDivHeight;



if (window.innerWidth<980){

  

  if(Math.round(invisibleDivHeight) < Math.round(invisibleDiv2Height))setAddressBarUp(true);

  else setAddressBarUp(false);
}



  //     const updateSize=()=>{
  //       if (window.innerWidth<980){
  //         const divHeight = Math.round(document.getElementById('invisibleDiv').getBoundingClientRect().height);
  //  const div2Height = Math.round(document.getElementById('invisibleDiv2').getBoundingClientRect().height);

  //         console.log('sizes', divHeight, div2Height)
          
  //       if(divHeight < div2Height){
  //         setAddressBarUp(true);
  //         window.removeEventListener('resize', updateSize);
  //       }
  //     }
  //     }
  //     if(invisibleDivHeight==invisibleDiv2Height)
  //     window.addEventListener('resize', updateSize);
  //     return () => window.removeEventListener('resize', updateSize);


  },[invisibleDivHeight,invisibleDiv2Height]);



 



  const renderEmptyCart = useCallback(() => {
    return <div className={styles.emptyCartDiv}>
    <p className={styles.emptyCartText}>
    Add your favorite items to your cart.
    </p>
    <Link className={styles.shopNowLink} href="/products">
          <button className={styles.shopNow}>Shop Now</button>
        </Link>
    </div>
  },[cartProducts]);

  const subtotal = cartProducts
    .reduce((sum, cp) => sum + cp.quantity * cp.price, 0)
    .toFixed(2);

  const renderCart = useCallback(() => {
   return  <>
      <div className={styles.itemsDiv}>
        {cartProducts.map((lineItem) => (
          <CartItem item={lineItem} key={lineItem.id} />
        ))}
      </div>
      <div className={styles.cardDetails}>
        <h4 className={styles.subtotalNew}>Subtotal: ${subtotal}</h4>
        <Link className={styles.checkoutButtonNew} href="/checkout">
         Checkout
        </Link>
      </div>
    </>
},[cartProducts]);





 
  return ( <div className={`${styles.containerStyle}`} style={{minHeight:`${addressBarUp?"calc(100svh - 64px)":"calc(100vh - 64px)"}`}}>

<div className={styles.cartContentWrapper}  style={{minHeight:`${cartProducts.length==0?'0':(addressBarUp?"calc(100svh - 64px)":"calc(100vh - 64px)")}`}}>
 
 
  <div id="invisibleDiv2" ref={obtainDiv2Height} className={`${styles.invisibleDiv2} ${styles.invisibleDiv}`}/>
  <div id="invisibleDiv" ref={obtainDivHeight} className={styles.invisibleDiv}/>
 
 

  
   
  {cartProducts.length === 0? <><h1 className={`${styles.title}  ${styles.emptyTitle}`}>Your cart is empty!</h1>
 {renderEmptyCart()}
  </>:
  <> <h1 className={styles.title}>Your shopping cart</h1>
   
      {renderCart()}
      </>
 
  }

</div>


<BestSellers/>
</div>
  );
};

export default Cart;
