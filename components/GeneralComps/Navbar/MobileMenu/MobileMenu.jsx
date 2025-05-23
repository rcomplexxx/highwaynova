import { useRouter } from "next/router";
import styles from "./mobilemenu.module.css";
import {  useEffect, useLayoutEffect, useRef } from "react";
import collections from '@/data/collections.json'
import Link from "next/link";
import { ArrowDown, CancelIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";
import useIsLargeScreen from "@/Hooks/useIsLargeScreen";

export default function MobileMenu({ isMenuOpen, setIsMenuOpen, subMenu, setSubMenu}){

 
  
  const isLargeScreen = useIsLargeScreen();
    const router = useRouter();
    const pathname = router.asPath;
  
    const mobileMenuRef= useRef();
    

    const nextLink= useRef();

    const completelyCloseMenuRef = useRef(false);
    



    


    const {  increaseDeepLink, decreaseDeepLink, shouldDeepLinkSurvivePopState } = useGlobalStore((state) => ({
     
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
      shouldDeepLinkSurvivePopState: state.shouldDeepLinkSurvivePopState,
    }));












    useEffect(()=>{


     
      increaseDeepLink('mobile_menu');
      

    
      
     
      return ()=>{ 
        
        
        decreaseDeepLink(nextLink.current);
      }
         
       },[])



  



   
       useLayoutEffect(() => {
      
        const closeMenu = () => {
         
          // mobileMenuRef.current.classList.add(styles.menuClosed);
          // window.removeEventListener("popstate", handlePopState);
          // setTimeout(() => setIsMenuOpen(false), 500);
          setIsMenuOpen(false);
        };





        const handlePopState = () => {
        
          if(shouldDeepLinkSurvivePopState('mobile_menu')) return;

          (subMenu===0 || (subMenu!==0 && completelyCloseMenuRef.current))?closeMenu():setSubMenu(0);

          

        };


      
        const handleClickOutside = (event) => {


          if (global.deepLinkLastSource !== "mobile_menu")  return;
          
        
          const target = event.target;
          const clickedNavBar = document.getElementById('navBar')?.contains(target);
          const clickedCart = document.getElementById('cart').contains(target);
          const clickedLogo = document.getElementById('logo').contains(target);


          const handleClickAction = (nextLinkArg) =>{

            event.stopPropagation();
              event.preventDefault();
              if(nextLinkArg) nextLink.current = nextLinkArg;
              subMenu !== 0 ? (completelyCloseMenuRef.current = true, history.go(-2)) : router.back();
          }



          if(clickedNavBar){

            if(clickedCart)handleClickAction('/cart');
            else if(clickedLogo)handleClickAction('/');
           return;

          }
        
        
           handleClickAction();
          
        };





       

      
        if(subMenu !== 0)  history.pushState(null, null, router.asPath);
          
        



        
        window.addEventListener("popstate", handlePopState);
        document.addEventListener('click', handleClickOutside, true);
      
        return () => {
          window.removeEventListener("popstate", handlePopState);
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, [subMenu]);












      useLayoutEffect(()=>{

        if(isLargeScreen && isMenuOpen){
          if(subMenu !== 0) { completelyCloseMenuRef.current=true; history.go(-2);}
          else router.back();
        };
      
        }

      ,[isLargeScreen, isMenuOpen])




 
    
    
      const handleLinkExecution = (url) => {
       
          

            nextLink.current=url;
            if(subMenu !== 0) { 
             completelyCloseMenuRef.current=true; history.go(-2);
            }

           else router.back();
           
        
      }

  
   

 



    return <div
    ref={mobileMenuRef}
      className={`${styles.mainMenuCard}` }
      
    >
    
   <CancelIcon color={`var(--mobile-nav-cancel-icon-color)`} styleClassName={styles.menuItem_x_button} handleClick={()=>{
          if(subMenu !== 0) { completelyCloseMenuRef.current=true; history.go(-2);}
          else router.back();
         
          
        }}/>
                      
                    

     
      
     
            {subMenu===0 &&
      <><Link
              href ='/'
        className={`${styles.linkStyle} ${pathname === "/" && styles.currentLinkMobile}`}
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ('/');
        }}
      >
       Home
      </Link>

      <Link
      href= '/products'
        className={`${styles.linkStyle} ${pathname === "/products" && styles.currentLinkMobile}`}
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ('/products');
        }}
      >
        Products
      </Link>

      <Link
      href= '/collection/sale/page/1'
       
        className={`${styles.linkStyle} ${
          pathname === "/collection/sale/page/1" &&  styles.currentLinkMobile
        }`}
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/collection/sale/page/1");
        }}
       
      >
        Sale
      </Link>


      <div
       
        className={`${styles.linkStyle} ${styles.subMenuPortal} `}
        onClick={() => {
          if(global.deepLinkLastSource !== 'mobile_menu') return;
          setSubMenu(2);
       
        }}
      >
        Collections
        <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={styles.subMenuArrow}/>
      </div>

    
      <div
       
        className={`${styles.linkStyle} ${styles.subMenuPortal} `}
        onClick={() => {
          if(global.deepLinkLastSource !== 'mobile_menu') return;
          setSubMenu(1);
          
        }}
      >
      Info
      <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={styles.subMenuArrow}/>
      </div>
     
      <Link href="/contact-us"
        className={`${styles.linkStyle} ${
          pathname === "/contact-us" && styles.currentLinkMobile
        }`}
       
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/contact-us");
        }}
      >
        Contact us
      </Link></>
        
      }

      {subMenu===1 && 
      <>
 <div
       
       className={`${styles.linkStyle}`}
       onClick={() => {
        
        router.back();
       }}
     >
       <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={`${styles.subMenuArrow} ${styles.subMenuBackArrow}`}/>
       <span className={styles.subMenuTitle}>Info</span>
     </div>

     <Link
     href='/our-story'
        className={`${styles.linkStyle} ${
          pathname === "/our-story" &&  styles.currentLinkMobile
        }`}

        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ('/our-story');
        }}
  
      
      >
        Our story
      </Link>


      <Link
     href='/faq'
        className={`${styles.linkStyle} ${
          pathname === "/faq" && styles.currentLinkMobile
        }`}
       
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ('/faq');
        }}
       
      >
        FAQ
      </Link>
       <Link
     href='/terms-of-service'
       
        className={`${styles.linkStyle} ${
          pathname === "/terms-of-service" && styles.currentLinkMobile
        }`}
        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/terms-of-service");
        }}
       
      >
        Terms of service
      </Link>
      <Link
     href='/privacy-policy'
      
        className={`${styles.linkStyle} ${
          pathname === "/privacy-policy" && styles.currentLinkMobile
        }`}

        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/privacy-policy");
        }}
        
      >
       Privacy policy
      </Link>
      <Link
      href="/shipping-policy"
     
        className={`${styles.linkStyle} ${
          pathname === "/shipping-policy" && styles.currentLinkMobile
        }`}


        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/shipping-policy");
        }}

       
      >
        Shipping policy
      </Link>
      <Link href="/refund-policy"
        className={`${styles.linkStyle} ${
          pathname === "/refund-policy" && styles.currentLinkMobile
        }`}


        onClick={(event) => {
          event.preventDefault();
          handleLinkExecution ("/refund-policy");
        }}
      
      >
        Refund policy
      </Link>
      </>
      }

       {subMenu===2 && <>

        <div
       
       className={`${styles.linkStyle} ${styles.subMenuTitle}`}
       onClick={() => {
         router.back();
       }}
     >
       <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={`${styles.subMenuArrow} ${styles.subMenuBackArrow}`}/>
       <span className={styles.subMenuTitle}>Collections</span>
     </div>

{collections.map((c, index) => {return <Link href={`/collection/${c.name.toLowerCase().replace(/ /g, '-')}/page/1`} key={index}
  className={`${styles.linkStyle} ${
    pathname === `/collection/${c.name.toLowerCase().replace(/ /g, '-')}/page/1` && styles.currentLinkMobile
  }`}

  onClick={(event) => {
    event.preventDefault();
    handleLinkExecution (`/collection/${c.name.toLowerCase().replace(/ /g, '-')}/page/1`);
  }}
 
  
  >
 {c.name}
  </Link>
})}
</>

       }









      
    
  </div>
}