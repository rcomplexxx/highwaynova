
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './search.module.css';
import collections from '@/data/collections.json'
import products from '@/data/products.json'
import { useRouter } from 'next/router';
import Image from 'next/image';
import { CancelIcon, SearchIcon } from '@/public/images/svgs/svgImages';
import { useGlobalStore } from '@/contexts/AppContext';
import Link from 'next/link';



export default function Search({searchOpen, setSearchOpen}){


    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    

    const searchBoxRef = useRef();
    
    const searchInputRef = useRef();

    
    






  

    const {increaseDeepLink, decreaseDeepLink, shouldRetainDeepLink } = useGlobalStore((state) => ({
     
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
      shouldRetainDeepLink: state.shouldRetainDeepLink
    }));


    
const navigateCloseSearch = useCallback((nextLinkArg) => {

      if(nextLinkArg) global.executeNextLink = nextLinkArg;
      router.back();
    }, [router]);


    const handleLinkExecution = (event, url) => {
           event.preventDefault();
            event.stopPropagation();
         navigateCloseSearch(url);

         setSearchTerm('');
        }
    
   



  
    useEffect(()=>{



     

        const handlePopState = ()=>{
         
          
          console.log('deepstate', global.deepLinkLastSource)
         
   if(shouldRetainDeepLink('search'))return;
    

          
          setSearchOpen(false);
          

      
          

          
        
        }

           
        const handleClickOutside = (event) => {
          if (global.deepLinkLastSource !== 'search')  return;
          
        
          

          const target = event.target;
          const clickedNavBar = document.getElementById('navBar')?.contains(target);
          const clickedCart = document.getElementById('cart').contains(target);
          const clickedLogo = document.getElementById('logo').contains(target);




             const handleClickAction = (url) =>{
              event.stopPropagation();
              event.preventDefault();
              
             navigateCloseSearch(url)
          }


       
   
          

    if(clickedNavBar){
      if(clickedCart) handleClickAction('/cart')
      else if(clickedLogo) handleClickAction('/')
      return;
    }

      handleClickAction();



        };



      



      if(searchOpen){


        const inputElement = document.getElementById('search');
        if (inputElement) inputElement.focus();
        


       
        
        increaseDeepLink('search');
        

        document.addEventListener('click', handleClickOutside, true);
        window?.addEventListener("popstate", handlePopState);
      }
     
  
        

     


    
        return () => {
          if(searchOpen) {
            document.removeEventListener('click', handleClickOutside, true);
            window?.removeEventListener("popstate", handlePopState);
             
            
             decreaseDeepLink();
          }
        };
    



    },[searchOpen])

   




   
    
   










   
  
    const filteredProducts = products.filter((product) =>
      searchTerm!=='' && product.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const filteredcollections = collections.filter((collection) =>
      searchTerm!=='' && collection.name.toLowerCase().includes(searchTerm.toLowerCase()));

      


    return <div className={`${styles.customSearchBar} ${searchOpen && styles.customSearchBarOpen}`}>
      <div className={styles.searchBarWrapper}>
          <input
          id='search'
          className={styles.customSearchBarInput}
          ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onFocus={()=>{setSearchOpen(true)}}
            onChange={(e) => setSearchTerm(e.target.value)}

            autoCapitalize="off"
          
          />

          <SearchIcon
          
          
          handleClick={()=>{


            if(searchOpen){
              
             navigateCloseSearch()

            }
            else{
              setSearchOpen(true);
            }
         
            
            }} styleClassName={styles.searchIcon}/>
       
          {/* Custom results section */}
          <div ref={searchBoxRef} className={`${styles.customResults} ${searchOpen && styles.itemsVisible}` }>


          {filteredcollections.length>0 && <div className={styles.resultProductsLabel}>Collections</div>}
            {filteredcollections.map((collection, index) => (
              <Link key={index} className={styles.resultItem} 
               href={`/collection/${collection.name.toLowerCase().replace(/ /g, '-')}/page/1`}
              onClick={(event)=>{
                handleLinkExecution(event,`/collection/${collection.name.toLowerCase().replace(/ /g, '-')}/page/1`);    
              }}

             
              onMouseDown={(event)=>{event.preventDefault()}}
           
              >
                <Image height={36} width={64} src={`/images/${collection.image}`} className={styles.searchItemImg}/>
                <strong>{collection.name}</strong>
                
              </Link>
            ))}





            {filteredProducts.length>0 && <div className={styles.resultProductsLabel}>Products</div>}
            {filteredProducts.map((product, index) => (
              <Link key={index} className={styles.resultItem} 
              href={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}

              onClick={(event)=>{
            handleLinkExecution(event,`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`) 
              }}

              >
                
                <Image height={36} width={64} src={`/images/${product.images[0]}`} className={styles.searchItemImg}/>
                <strong>{product.name}</strong>
                
              </Link>
            ))}
          </div>
         
          </div>
          {searchOpen && 
          
          <CancelIcon color={`var(--search-cancel-icon-color)`} styleClassName={styles.searchCancel} 
            handleClick={()=>{navigateCloseSearch()}}
          />
        }
        </div>
    
    
    
    
            
    
    
}