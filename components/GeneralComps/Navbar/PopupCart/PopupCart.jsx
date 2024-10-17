

import Link from 'next/link'
import styles from './popupcart.module.css'
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CorrectIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';



export default function PopupCart({totalItems,newProducts, setNewProducts}){


const router = useRouter();

const popCartRef=useRef();

const nextLink = useRef();






const { deepLink, increaseDeepLink, decreaseDeepLink } = useGlobalStore((state) => ({
  deepLink: state.deepLink,
  increaseDeepLink: state.increaseDeepLink,
  decreaseDeepLink: state.decreaseDeepLink,
}));




useLayoutEffect(()=>{
  
  popCartRef.current.style.height= `${popCartRef.current.scrollHeight}px`;


},[])








useEffect(()=>{




  const handlePopState = ()=>{

    console.log('LINK!', global.deepLinkLastSource)

    // if(!global.executeNextLink  && global.deepLinkLastSource !== 'pop_cart') return;
    if(!global.executeNextLink && global.deepLinkLastSource !== 'pop_cart')return;

    console.log('proso ovo sranje')
    
    setNewProducts([]);
    window?.removeEventListener("popstate", handlePopState);

   
   
  
  }



  const handleClick = (event) => {

    if(!global.executeNextLink && global.deepLinkLastSource !== 'pop_cart') return;
  
    
    if (!document.getElementById('navBar').contains(event.target)){  

      event.stopPropagation();
      event.preventDefault();
    
      router.back();

    }
      

    else if(document.getElementById('cart').contains(event.target)){


      event.stopPropagation();
      event.preventDefault();
      nextLink.current = '/cart';
      router.back();
      
    
    }

    
    
  };
     

  history.pushState(null, null, router.asPath);
  


  window?.addEventListener("popstate", handlePopState);
  document.addEventListener('click', handleClick, true);
  
  increaseDeepLink('pop_cart');

  return ()=>{

    console.log('end of this shit!', nextLink.current)
   
    window?.removeEventListener("popstate", handlePopState);
    document.removeEventListener('click', handleClick, true);
    decreaseDeepLink(nextLink.current);

   

  }
},[])




const handlePopCartLinkClick=(url)=>{
  
 
    nextLink.current= url;
  router.back();

}





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
    event.preventDefault();
    handlePopCartLinkClick('/cart')
  }}
     >

      View cart ({totalItems})
    
    </Link>

    <Link href='/checkout' className={styles.checkoutButton} 
     onClick={(event)=>{
      event.preventDefault();
      handlePopCartLinkClick('/checkout')
    }}
    >
    
     Checkout
  
    </Link>
    
    <span className={styles.continue_shopping}  onClick={()=>{ router.back();}}>Continue shopping</span>
    

 
  </div>
}