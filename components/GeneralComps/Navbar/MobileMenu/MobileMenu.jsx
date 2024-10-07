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

    const doubleBackRef = useRef(false);



    


    const { emailPopupOn } = useGlobalStore((state) => ({
      emailPopupOn: state.emailPopupOn,
    }));






    useEffect(()=>{


      history.pushState(null, null, router.asPath);
     
   
         
       },[])



  



   
       useEffect(() => {
        const handleResize = () => window.innerWidth > 980 && setIsMenuOpen(false);
      
        const closeMenu = () => {
          document.getElementById('mobileMenu').classList.add(styles.menuClosed);
          window.removeEventListener("popstate", handlePopState);
          setTimeout(() => setIsMenuOpen(false), 500);
        };

        const handlePopState = () => {
          if (emailPopupOn) return;

          subMenu !== 0 ? (doubleBackRef.current?closeMenu():setSubMenu(0)) : closeMenu();
          
          if(nextLink.current && nextLink.current !== router.asPath) router.push(nextLink.current);
          
        
          



        };


      
        const handleClickOutside = (event) => {
          if (emailPopupOn || document.getElementById('mobileMenu').contains(event.target) || document.getElementById('mobileMenuSpawn').contains(event.target)) return;
          event.preventDefault();
          if(subMenu !== 0) { doubleBackRef.current; history.go(-2);}
          else router.back();
        };
      
       

      
        if(subMenu !== 0) {  
          history.pushState(null, null, router.asPath);
          
        }
        
        window.addEventListener("resize", handleResize);
        window.addEventListener("popstate", handlePopState);
        document.addEventListener('click', handleClickOutside, true);
      
        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("popstate", handlePopState);
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, [subMenu, emailPopupOn]);




 
    
    
      const handleLinkExecution = (url) => {
       
          

            nextLink.current=url;
            if(subMenu !== 0) { 
             doubleBackRef.current=true; history.go(-2);
            }

           else router.back();
           
        
      }

  
   

 



    return <div
    id='mobileMenu'
      className={`${styles.mainMenuCard}` }
      
    >
    
   <CancelIcon color={`var(--mobile-nav-cancel-icon-color)`} styleClassName={styles.menuItem_x_button} handleClick={()=>{
          if(subMenu !== 0) { doubleBackRef.current=true; history.go(-2);}
          else router.back();
         
        // setIsMenuOpen(false); 
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