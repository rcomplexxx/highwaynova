

import Link from 'next/link'
import styles from './popupcart.module.css'
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CorrectIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';



export default function PopupCart({totalItems,newProducts, setNewProducts}){


const router = useRouter();

const popCartRef=useRef();

const nextLink = useRef();






const { increaseDeepLink, decreaseDeepLink, shouldDeepLinkSurvivePopState } = useGlobalStore((state) => ({

  increaseDeepLink: state.increaseDeepLink,
  decreaseDeepLink: state.decreaseDeepLink,
  shouldDeepLinkSurvivePopState: state.shouldDeepLinkSurvivePopState,
}));


 const navigateClosePopupCart = useCallback((nextLinkArg) => {

      if(nextLinkArg) nextLink.current = nextLinkArg;
      router.back();
    }, [router]);


    const handleLinkExecution = (event, url) => {
          event.preventDefault();
         navigateClosePopupCart(url);
        }




useLayoutEffect(()=>{
  
  popCartRef.current.style.height= `${popCartRef.current.scrollHeight}px`;


},[])








useEffect(()=>{




  const handlePopState = ()=>{

    

    
    if(shouldDeepLinkSurvivePopState('pop_cart'))return;

    console.log('proso ovo sranje')
    
    setNewProducts([]);
    window?.removeEventListener("popstate", handlePopState);

   
   
  
  }



  const handleClick = (event) => {

    if (global.deepLinkLastSource !== 'pop_cart')  return;

    
  
    const target = event.target;
    const clickedNavBar = document.getElementById('navBar').contains(target);
    const clickedCart = document.getElementById('cart').contains(target);
    const clickedLogo = document.getElementById('logo').contains(target);



     
    

   const handleClickAction = (url) =>{

            event.stopPropagation();
              event.preventDefault();
              
              navigateCloseMenu(url);
          }
   
          

    if(clickedNavBar){
      if(clickedCart) handleClickAction('/cart')
      else if(clickedLogo) handleClickAction('/')
      return;
    }

      handleClickAction();

    
  };
     

  
  
  increaseDeepLink('pop_cart');
  
 

  window?.addEventListener("popstate", handlePopState);
  document.addEventListener('click', handleClick, true);
  

  return ()=>{

    console.log('end of this shit!', nextLink.current)
   
    window?.removeEventListener("popstate", handlePopState);
    document.removeEventListener('click', handleClick, true);
    
    decreaseDeepLink(nextLink.current);

   

  }
},[navigateClosePopupCart])











    return <div id='popCart' ref={popCartRef} className={`${styles.cartPopup}`} >
  
  <div className={`${styles.productWrapper} ${styles .firstPopupTitle}`}>


    <CorrectIcon color={`var(--popcart-correct-icon-color)`} styleClassName={styles.smallCorrect}/>
     <h3 className={styles.popCartMainTitle}>Added:</h3>

     
      </div>



      <div className={styles.newProducts}>

    {newProducts.map((newProduct,index) =>{  
 
 
 return <div key = {index} className={styles.productWrapper}> 

 <div className={styles.productImageWrapper}>
 <Image height={64} width={64} src={`/images/${newProduct.image}`} alt='Bought product image' priority={true} loading='eager' className={styles.productImage}/> 

 <div className={styles.badgeDiv}>{newProduct.quantity}</div>


 </div>
 <div className={styles.productTitleDiv}>
 <span className={styles.productTitle}>{newProduct.name}</span>
 <span className={styles.productVariant}>{newProduct.variant}</span>
 </div>
 </div>

    })}

</div>

 

  <Link href='/cart'  className={`${styles.viewCartButton} mainButton`}
  onClick={(event)=>{
    handleLinkExecution(event, '/cart')
  }}
     >

      View cart ({totalItems})
    
    </Link>

    <Link href='/checkout' className={styles.checkoutButton} 
     onClick={(event)=>{
      handleLinkExecution(event, '/checkout')
    }}
    >
    
     Checkout
  
    </Link>
    
    <span className={styles.continue_shopping}  onClick={()=>{navigateClosePopupCart()}}>Continue shopping</span>
    

 
  </div>
}