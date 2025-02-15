
import { useEffect, useRef, useState } from 'react';
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

    
    const nextLink= useRef();






  

    const {increaseDeepLink, decreaseDeepLink } = useGlobalStore((state) => ({
      deepLink: state.deepLink,
      increaseDeepLink: state.increaseDeepLink,
      decreaseDeepLink: state.decreaseDeepLink,
    }));


    

    
   



  
    useEffect(()=>{



     

        const handlePopState = ()=>{
         
          
         
    if(!global.executeNextLink && global.deepLinkLastSource !== 'search') return;
    
          console.log('deepstate', global.deepLinkLastSource)

          
          setSearchOpen(false);
          window?.removeEventListener("popstate", handlePopState);

      
          

          
        
        }

           
        const handleClickOutside = (event) => {
          if (global.deepLinkLastSource !== 'search') {
            event.stopPropagation();
            event.preventDefault();
            return;
          }
        
          if (document.getElementById('navBar')?.contains(event.target)) return;
        
          event.stopPropagation();
          event.preventDefault();
          router.back();
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
            
             decreaseDeepLink(nextLink.current);
             nextLink.current=undefined;
          }
        };
    



    },[searchOpen])

   




   

   










    const handleSearch = (term) => {
      setSearchTerm(term);
    };
  
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
            onChange={(e) => handleSearch(e.target.value)}

            autoCapitalize="off"
          
          />

          <SearchIcon
          
          
          handleClick={()=>{


            if(searchOpen){
              
             

              router.back();

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
              onClick={(event)=>{
            
                event.preventDefault();
                event.stopPropagation();
            nextLink.current=`/collection/${collection.name.toLowerCase().replace(/ /g, '-')}/page/1`;
           router.back();
              
          setSearchTerm('');
              
              }}

              href={`/collection/${collection.name.toLowerCase().replace(/ /g, '-')}/page/1`}
              onMouseDown={(event)=>{event.preventDefault()}}
           
              >
                <Image height={36} width={64} src={`/images/${collection.image}`} className={styles.searchItemImg}/>
                <strong>{collection.name}</strong>
                
              </Link>
            ))}





            {filteredProducts.length>0 && <div className={styles.resultProductsLabel}>Products</div>}
            {filteredProducts.map((product, index) => (
              <Link key={index} className={styles.resultItem} 
              onClick={(event)=>{
            
                event.preventDefault();
                event.stopPropagation();
            nextLink.current=`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`;
           router.back();
        
           
          setSearchTerm('');
              
              }}

              href={`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
              
              >
                
                <Image height={36} width={64} src={`/images/${product.images[0]}`} className={styles.searchItemImg}/>
                <strong>{product.name}</strong>
                
              </Link>
            ))}
          </div>
         
          </div>
          {searchOpen && 
          
          <CancelIcon color={`var(--search-cancel-icon-color)`} styleClassName={styles.searchCancel} 
         
          />
        }
        </div>
    
    
    
    
            
    
    
}