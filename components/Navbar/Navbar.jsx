import  { useState, useEffect,  useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./navbar.module.css";
import Image from "next/image";

import collections from "@/data/collections.json";
import Search from "./Search/Search";

import dynamic from "next/dynamic";
import { ArrowDown, MenuIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";

// import MobileMenu from "./MobileMenu/MobileMenu";
const MobileMenu = dynamic(() => import("./MobileMenu/MobileMenu"));
const PopupCart = dynamic(() => import("./PopupCart/PopupCart"));

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);



  const router = useRouter();
  const pathname = router.asPath;

  const handleMobileMenuOpen = (event) => {
    // event.stopPropagation();
   
    setSubMenu(0);
    setIsMenuOpen(true);
  };

  const { cartProducts, newProduct, setNewProduct } = useGlobalStore(state => ({
    cartProducts: state.cartProducts,
    newProduct: state.newProduct,
    setNewProduct: state.setNewProduct,
  }));

  console.log('nav change', isMenuOpen, newProduct)

  const totalItems= useMemo(()=>{
    let s=0;
    cartProducts.forEach(cp=>{
      s=s+cp.quantity;
    })
    return s
  },[cartProducts])

  useEffect(() => {



    let handleClickOutside = (event) => {
        
      if(isMenuOpen)return;

      if (
        (subMenu == 1 && !document?.getElementById("infoDropMenuLink").contains(event.target)) ||
        (subMenu == 2 && !document?.getElementById("collectionsDropMenuLink").contains(event.target))
      ) {
        
        setSubMenu(0);
      }
    
    };


    

    if (subMenu !=0) {
  

    document.getElementById(`${subMenu == 1?"collectionsDropMenu":"infoDropMenu"}`).style.top = "calc(100% + var(--size-3))";//40px

      document?.addEventListener("click", handleClickOutside, true);
    } 

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [subMenu]);


  return (
    <>
      {(newProduct || searchOpen || isMenuOpen) && (
        <div className={styles.substituteDiv} />
      )}

      <nav
        className={`${styles.appBar} ${
          (newProduct || searchOpen || isMenuOpen) && styles.appBarFixed
        } ${newProduct && window.scrollY > 0 && styles.appBarMaterialize}`}
      
        id="navBar"
      >
        <div className={styles.toolbarDiv}>
          <div className={styles.growAlt}>

            <MenuIcon
             
             handleClick={handleMobileMenuOpen} styleClassName={styles.smallMenuImage}/>
          
            
          
            <Link href="/" className={styles.logoLink}>
              <Image
                height={0}
                width={0}
                sizes="32px"
                src="/images/commercebook.jpg"
                alt={`${process.env.NEXT_PUBLIC_SITE_NAME} icon`}
                className={styles.image}
              />
              <h1 className={styles.title}>
                {/* {process.env.NEXT_PUBLIC_SITE_NAME} */}
                Lightbook
              </h1>
            </Link>
          </div>

          <div className={styles.grow}>
            <Link
              href="/"
              className={`${styles.linkStyle} ${
                pathname === "/" && styles.currentLink
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`${styles.linkStyle} ${
                pathname === "/products" && styles.currentLink
              }`}
            >
              Products
            </Link>

            <Link
              href="/collection/sale/page/1"
              className={`${styles.linkStyle} ${
                pathname === "/collection/sale/page/1" && styles.currentLink
              }`}
            >
              Sale
            </Link>

            <div className={styles.subMenuPortal}>
              <div
                id="collectionsDropMenuLink"
                className={`${styles.subMenuTitle} ${styles.linkStyle}`}
                onClick={() => {
                  setSubMenu(subMenu == 2 ? 0 : 2);
                }}
              >
                <span>Collections</span>

                <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={`${styles.subMenuArrow} ${
                    subMenu == 2 && styles.subMenuArrowOpen
                  }`}/>
                
              </div>
             
                <div id="collectionsDropMenu" className={`${styles.subMenu} ${subMenu == 2 && styles.showSubMenu}`}>
                  {collections.map((c, index) => {
                    const linkUrl= `/collection/${c.name
                      .toLowerCase()
                      .replace(/ /g, "-")}/page/1`;
                    return (
                      <Link
                      key={index}
                        href={linkUrl}
                        className={`${styles.subMenuLink} ${ pathname ===linkUrl && styles.currentLinkMobile }`}
                        onClick={() => {
                          setSubMenu(0);
                        }}
                      >
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
            
            </div>

            <div className={styles.subMenuPortal}>
              <div
                id="infoDropMenuLink"
                className={`${styles.subMenuTitle} ${styles.linkStyle}`}
                onClick={() => {
                  setSubMenu(subMenu == 1 ? 0 : 1);
                }}
              >
                <span>Info</span>
                <ArrowDown color={'var(--navbar-arrow-color)'} styleClassName={`${styles.subMenuArrow} ${
                    subMenu == 1 && styles.subMenuArrowOpen
                  }`}/>
               
              </div>
              
                <div
                  id="infoDropMenu"
                 
                  className={`${styles.subMenu} ${subMenu == 1 && styles.showSubMenu}`}
                >
                  <Link
                    href="/our-story"
                    className={`${styles.subMenuLink} ${
                      pathname === "/our-story" && styles.currentLinkMobile
                    }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    Our story
                  </Link>

                  <Link
                    href="/faq"
                    className={`${styles.subMenuLink} ${
                      pathname === "/faq" && styles.currentLinkMobile
                    }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    FAQ
                  </Link>

                  <Link
                    href="/terms-of-service"
                    className={`${styles.subMenuLink} ${
                      pathname === "/terms-of-service" &&
                      styles.currentLinkMobile
                    }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    Terms of service
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className={`${styles.subMenuLink} ${
                      pathname === "/privacy-policy" && styles.currentLinkMobile
                    }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    Privacy policy
                  </Link>
                  <Link
                    href="/shipping-policy"
                    className={`${styles.subMenuLink} ${
                      pathname === "/shipping-policy" &&
                      styles.currentLinkMobile
                    }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    Shipping policy
                  </Link>
                  <Link
                    href="/refund-policy"
                    className={`${styles.subMenuLink} ${ pathname === "/refund-policy" && styles.currentLinkMobile }`}
                    onClick={() => {
                      setSubMenu(0);
                    }}
                  >
                    Refund policy
                  </Link>
                </div>
             
            </div>

            <Link
              href="/contact-us"
              className={`${styles.linkStyle} ${
                pathname === "/contact-us" && styles.currentLink
              }`}
            >
              Contact us
            </Link>
          </div>

          <div className={styles.rightOptions}>
            <Search searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            <Link id="cart" href="/cart">
              <div className={styles.cartStyle}>
                <Image
                  height={0}
                  width={0}
                  sizes="48px"
                  src="/images/bag.png"
                  className={styles.bagImg}
                  alt="cart"
                />
                {totalItems > 0 && (
                  <div className={styles.badgeDiv}>{totalItems}</div>
                )}
              </div>
            </Link>
          </div>
        </div>
        {newProduct && (
          <PopupCart
            totalItems={totalItems}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />
        )}
          {isMenuOpen && (
        <MobileMenu
        
          subMenu={subMenu}
          setSubMenu={setSubMenu}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
      </nav>

    
    </>
  );
};

export default NavBar;
