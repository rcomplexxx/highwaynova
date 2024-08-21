

import Link from 'next/link'
import styles from './popupcart.module.css'
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CorrectIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';



export default function PopupCart({totalItems,newProduct, setNewProduct}){


const router = useRouter();

const popCartRef=useRef();

const nextLink = useRef();




const { increaseDeepLinkLevel, decreaseDeepLinkLevel } = useGlobalStore((state) => ({
  increaseDeepLinkLevel: state.increaseDeepLinkLevel,
  decreaseDeepLinkLevel: state.decreaseDeepLinkLevel,
}));






useEffect(()=>{



  


  const popCart= popCartRef.current;
  popCart.style.height= `${popCart.scrollHeight}px`;
  console.log('pop', popCart.scrollHeight)
 


  window.history.pushState(null, null, router.asPath);
  history.go(1);
  increaseDeepLinkLevel();


  const handlePopState = (event)=>{

    
    if(nextLink.current)router.push(nextLink.current);
   
   
    setNewProduct();
    window?.removeEventListener("popstate", handlePopState);
  
  }

  const navBar = document.getElementById('navBar')
  const handleClick = (event) => {
  
    if (!navBar.contains(event.target)) {
    
      history.back();
      decreaseDeepLinkLevel();
      
    }

    else if(document.getElementById('cart').contains(event.target) || document.getElementById('mobileMenuSpawn').contains(event.target)){
        setNewProduct();
    
    }

    

      
  
    
    // }
  };
     


  window?.addEventListener("popstate", handlePopState);
  document.addEventListener('click', handleClick);
  


  return ()=>{

   
    window?.removeEventListener("popstate", handlePopState);
    document.removeEventListener('click', handleClick);
   

   

  }
},[])


console.log('my new product', newProduct)

// useEffect(()=>{ popupCart.focus();},[])

const handlePopCartLinkClick=(event, nextLinkHref)=>{
  event.preventDefault();
 
    nextLink.current= nextLinkHref;
  history.back();
  decreaseDeepLinkLevel();

}

    return <div id='popCart' ref={popCartRef} className={`${styles.cartPopup}`} >
  
  <div className={`${styles.cartPopupTitle} ${styles .firstPopupTitle}`}>
    <CorrectIcon color={`var(--popcart-correct-icon-color)`} styleClassName={styles.smallCorrect}/>
     <h3 className={styles.popCartMainTitle}>Added:</h3>
      </div>
 <div className={styles.cartPopupTitle}> 
 <Image height={64} width={64} src={`/images/${newProduct.image}`} alt='Bought product image' className={styles.productImage}/> 
 <div className={styles.productTitleDiv}>
 <span className={styles.productTitle}>{newProduct.name}</span>
 <span className={styles.productVariant}>{newProduct.variant}</span>
 </div>
 </div>

 

  <Link href='/cart'  className={`${styles.viewCartButton} mainButton`}
  onClick={(event)=>{
    handlePopCartLinkClick(event, '/cart')
  }}
     >

      View cart ({totalItems})
    
    </Link>

    <Link href='/checkout' className={styles.checkoutButton} 
     onClick={(event)=>{
      handlePopCartLinkClick(event, '/checkout')
    }}
    >
    
     Checkout
  
    </Link>
    
    <span className={styles.continue_shopping}  onClick={()=>{ history.back();decreaseDeepLinkLevel();}}>Continue shopping</span>
    

 
  </div>
}