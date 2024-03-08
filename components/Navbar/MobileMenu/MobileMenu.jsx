import { useRouter } from "next/router";
import styles from "./mobilemenu.module.css";
import {  useEffect, useRef } from "react";
import collections from '@/data/collections.json'
import Image from "next/image";
import Link from "next/link";

export default function MobileMenu({ setIsMenuOpen, subMenu, setSubMenu}){

 
  

    const router = useRouter();
    const pathname = router.asPath;
  
    

    const nextLink= useRef();
    const backBlocker = useRef(false);

    const whiteButtonCancelRef= useRef(false);



  



   
    useEffect(() => {

      const handleResize = () =>{
        if (window.innerWidth>980)setIsMenuOpen(false);
      }

   
      const closeMenu = ()=>{ 
        
        document.getElementById('mobileMenu').classList.add(styles.menuClosed);
        window?.removeEventListener("popstate", handlePopState);
        setTimeout(()=>{
       
        
        setIsMenuOpen(false);
      },500)
    
    };

      const handleClickOutside = (event) => {

       
        

         if(!document?.getElementById('mobileMenu').contains(event.target) && !document?.getElementById('mobileMenuSpawn').contains(event.target))
       { 
        
        event.stopPropagation(); 
        event.preventDefault(); 
        
        
          closeMenu();
          if(subMenu!=0){
          history.back();
        }
        history.back();
      
        // document.removeEventListener('click', handleClickOutside, true);
      
      
      }
        
      };






      const handlePopState = ()=>{
        
        console.log('popon')
       

       if(backBlocker.current){
        // backBlocker.current=false;
        // if(subMenu!=0){
        //   history.back();
        
        // }

        // closeMenu();
      
       
        return;
       }

       if(whiteButtonCancelRef.current){
        closeMenu();
        if(subMenu!=0){
        history.back();
      }

       }


        if( nextLink.current){
          
         
         
          // if(subMenu!=0){
          //   history.back();
          
          // }

          window?.removeEventListener("popstate", handlePopState);
          closeMenu();
          router.push(nextLink.current);
          
          return;
        }
       
       if(subMenu!=0 ) {
        
       
      setSubMenu(0); 

   
        
      }
    
       else {
      



          closeMenu();
   
      }
       
         console.log('popstate')
      }








 

        if(subMenu!=0){
            window.history.pushState(null, null, router.asPath);
        
        history.go(1);
        }
      

     
       
        window?.addEventListener("resize", handleResize);
        window?.addEventListener("popstate", handlePopState);
        document?.addEventListener('click', handleClickOutside, true);
  
      return () => {
        
       
          window?.removeEventListener("resize", handleResize);
          window?.removeEventListener("popstate", handlePopState);
          document?.removeEventListener('click', handleClickOutside, true);
         
        
      };
    }, [subMenu]);





 
    
    


    useEffect(()=>{


   window.history.pushState(null, null, router.asPath);
                history.go(1);

      router.beforePopState((state) => {
        
        state.options.scroll = false;
          
        return true;
     
      });
    },[])
   

 



    return <div
    id='mobileMenu'
      className={`${styles.mainMenuCard}` }
      
    >
    
   
      <Image loading={'lazy'} alt='Cancel' height={16} width={16} src='/images/cancelWhite.png' 
      onClick={()=>{
        whiteButtonCancelRef.current= true
         history.back();
         
        // setIsMenuOpen(false); 
        }} className={styles.menuItem_x_button}/>                 
                    

     
      
     
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
       
        className={`${styles.subMenuPortal} ${styles.linkStyle}`}
        onClick={() => {
          setSubMenu(2);
       
        }}
      >
        Collections
        <Image loading={'lazy'} alt='Go' height={12} width={12} src="/images/greaterLessx.png" className={styles.subMenuArrow}/>
      </div>

    
      <div
       
        className={`${styles.subMenuPortal} ${styles.linkStyle}`}
        onClick={() => {
          setSubMenu(1);
          
        }}
      >
      Info
        <Image loading={'lazy'} alt='Go' height={12} width={12} src="/images/greaterLessx.png" className={styles.subMenuArrow}/>
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
        
         setSubMenu(0);
       }}
     >
       <Image loading={'lazy'} alt='Back' height={12} width={12} src="/images/greaterLessx.png" className={`${styles.subMenuArrow} ${styles.subMenuBackArrow}`}/>
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
         setSubMenu(0);
       }}
     >
       <Image loading={'lazy'} alt='Back' height={12} width={12} src="/images/greaterLessx.png" className={`${styles.subMenuArrow} ${styles.subMenuBackArrow}`}/>
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