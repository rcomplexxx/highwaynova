

import Link from 'next/link'
import styles from './popupcart.module.css'
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';



export default function PopupCart({totalItems,newProduct, setNewProduct}){


const router = useRouter();

const popCartRef=useRef();

const nextLink = useRef();








useEffect(()=>{



  
  router.beforePopState((state) => {
        
    state.options.scroll = false;
      
    return false;
 
  });



  const popCart= popCartRef.current;
  popCart.style.height= `${popCart.scrollHeight}px`;
  console.log('pop', popCart.scrollHeight)
 


  window.history.pushState(null, null, router.asPath);
  history.go(1);


  const handlePopState = (event)=>{

    
    if(nextLink.current)router.push(nextLink.current);
   
   
    setNewProduct();
  
  }

  const navBar = document.getElementById('navBar')
  const handleClick = (event) => {
  
    if (!navBar.contains(event.target) ) {
    
      history.back();
      
    }
    // else if (navBar.contains(document.getElementById('mobileMenuSpawn'))) {
   
      
    
    // }
  };
     


  window?.addEventListener("popstate", handlePopState);
  document.addEventListener('click', handleClick);
  


  return ()=>{

   
    window?.removeEventListener("popstate", handlePopState);
    document.removeEventListener('click', handleClick);
   

   

  }
},[])




// useEffect(()=>{ popupCart.focus();},[])

const handlePopCartLinkClick=(event, nextLinkHref)=>{
  event.preventDefault();
 
    nextLink.current= nextLinkHref;
  history.back();

}

    return <div id='popCart' ref={popCartRef} className={`${styles.cartPopup}`} >
  
  <div className={`${styles.cartPopupTitle} ${styles .firstPopupTitle}`}>
     <Image height={12} width={12} src='/images/correctDark.svg' className={styles.smallCorrect}/>
     <h3 className={styles.popCartMainTitle}>Item added to your cart</h3>
      </div>
 <div className={styles.cartPopupTitle}> 
 <Image height={64} width={64} src={`/images/${newProduct.image}`} className={styles.productImage}/> 
 <div className={styles.productTitleDiv}>
 <span className={styles.productTitle}>{newProduct.name}</span>
 <span className={styles.productVariant}>{newProduct.variant}</span>
 </div>
 </div>

 

  <Link href='/cart'  className={styles.add_to_cart_button}
  onClick={(event)=>{
    handlePopCartLinkClick(event, '/cart')
  }}
     >

      View my cart ({totalItems})
    
    </Link>

    <Link href='/checkout' className={styles.checkoutButton} 
     onClick={(event)=>{
      handlePopCartLinkClick(event, '/checkout')
    }}
    >
    
     Check out
  
    </Link>
    
    <span className={styles.continue_shopping}  onClick={()=>{ history.back();}}>Continue shopping</span>
    

 
  </div>
}