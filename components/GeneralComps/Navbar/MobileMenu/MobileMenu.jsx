import { useRouter } from "next/router";
import styles from "./mobilemenu.module.css";
import {  useEffect, useRef } from "react";
import collections from '@/data/collections.json'
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, CancelIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";

export default function MobileMenu({ setIsMenuOpen, subMenu, setSubMenu}){

 
  

    const router = useRouter();
    const pathname = router.asPath;
  
    

    const nextLink= useRef();
    const subMenuBackDone= useRef(false);

    const whiteButtonCancelRef= useRef(false);


    const { emailPopupOn } = useGlobalStore((state) => ({
      emailPopupOn: state.emailPopupOn,
    }));






    useEffect(()=>{


      window.history.pushState(null, null, router.asPath);
                   history.go(1);
   
         
       },[])



  



   
       useEffect(() => {
        const handleResize = () => window.innerWidth > 980 && setIsMenuOpen(false);
      
        const closeMenu = () => {
          document.getElementById('mobileMenu').classList.add(styles.menuClosed);
          window.removeEventListener("popstate", handlePopState);
          setTimeout(() => setIsMenuOpen(false), 500);
        };
      
        const handleClickOutside = (event) => {
          if (emailPopupOn || document.getElementById('mobileMenu').contains(event.target) || document.getElementById('mobileMenuSpawn').contains(event.target)) return;
          event.preventDefault();
          closeMenu();
          subMenu !== 0 && history.back();
          history.back();
        };
      
        const handlePopState = () => {
          if (emailPopupOn) return;
          if (whiteButtonCancelRef.current) {
            closeMenu();
            subMenu !== 0 && history.back();
            return;
          }
          if (nextLink.current) {
            if (subMenu !== 0 && !subMenuBackDone.current) {
              subMenuBackDone.current = true;
              history.back();
              return;
            }
            window.removeEventListener("popstate", handlePopState);
            closeMenu();
            router.push(nextLink.current, undefined, { shallow: true });
            return;
          }
          subMenu !== 0 ? setSubMenu(0) : closeMenu();
        };
      
        subMenu !== 0 && history.go(1);
        
        window.addEventListener("resize", handleResize);
        window.addEventListener("popstate", handlePopState);
        document.addEventListener('click', handleClickOutside, true);
      
        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("popstate", handlePopState);
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, [subMenu, emailPopupOn]);




 
    
    


  
   

 



    return <div
    id='mobileMenu'
      className={`${styles.mainMenuCard}` }
      
    >
    
   <CancelIcon color={`var(--mobile-nav-cancel-icon-color)`} styleClassName={styles.menuItem_x_button} handleClick={()=>{
        whiteButtonCancelRef.current= true
         history.back();
         
        // setIsMenuOpen(false); 
        }}/>
                      
                    

     
      
     
            {subMenu===0 &&
      <><Link
              href ='/'
        className={`${styles.linkStyle} ${pathname === "/" && styles.currentLinkMobile}`}
        onClick={(event) => {
          event.preventDefault();
          if(pathname !== "/") { 
            nextLink.current='/';
           
           history.back();

          }
        }}
      >
       Home
      </Link>

      <Link
      href= '/products'
        className={`${styles.linkStyle} ${pathname === "/products" && styles.currentLinkMobile}`}
        onClick={(event) => {
          event.preventDefault();
          if(pathname !== "/products") { 
            nextLink.current='/products';
            history.back();

          }
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
          if(pathname !== "/collection/sale/page/1") { 
            nextLink.current='/collection/sale/page/1';
           history.back();

          }
        }}
      >
        Sale
      </Link>


      <div
       
        className={`${styles.linkStyle} ${styles.subMenuPortal} `}
        onClick={() => {
          setSubMenu(2);
       
        }}
      >
        Collections
        <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={styles.subMenuArrow}/>
      </div>

    
      <div
       
        className={`${styles.linkStyle} ${styles.subMenuPortal} `}
        onClick={() => {
          setSubMenu(1);
          
        }}
      >
      Info
      <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={styles.subMenuArrow}/>
      </div>
     
      <Link href="/contant-us"
        className={`${styles.linkStyle} ${
          pathname === "/contact-us" && styles.currentLinkMobile
        }`}
       
        onClick={(event) => {
          event.preventDefault();
          if(pathname !== "/contact-us") { 
            nextLink.current='/contact-us';
           history.back();

          }
        }
      }
      >
        Contact us
      </Link></>
        
      }

      {subMenu===1 && 
      <>
 <div
       
       className={`${styles.linkStyle}`}
       onClick={() => {
        
        history.back();
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
          if(pathname !== "/our-story") { 
            nextLink.current='/our-story';
           history.back();

          }
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
          if(pathname !== "/faq") { 
            nextLink.current="/faq";
           history.back();

          }
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
          if(pathname !== "/terms-of-service") { 
            nextLink.current="/terms-of-service";
           history.back();
          }
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
          if(pathname !== "/privacy-policy") { 
        
            nextLink.current="/privacy-policy";
           history.back();
          }
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
          if(pathname !== "/shipping-policy") { 
       
            nextLink.current="/shipping-policy";
           history.back();
          }
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
          if(pathname !== "/refund-policy") { 
         
            nextLink.current="/refund-policy";
           history.back();
          }
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
         history.back();
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
    if(pathname !== `/collection/${c.name.toLowerCase().replace(/ /g, '-')}/page/1`) { 

      nextLink.current=`/collection/${c.name.toLowerCase().replace(/ /g, '-')}/page/1`;
     history.back();
    }
    
  }}
  >
 {c.name}
  </Link>
})}
</>

       }









      
    
  </div>
}