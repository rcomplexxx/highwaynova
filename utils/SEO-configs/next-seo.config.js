
import products from '../../data/products.json'
import collections from '../../data/collections.json'






const siteName= process.env.NEXT_PUBLIC_WEBSITE_NAME;
const siteUrlTail = 'https://selling-game-items-next.vercel.app';
const siteMiniDescription = 'Buy perfect equipment for deep-night gaming';

const createPageSeo = (title, description, pagePath, imageName, ogTitle, ogDescription, noFollow, noIndex)=>{

  return {
    title: title,
    description: description,
    url:`${siteUrlTail}${pagePath}`,
    canonical:`${siteUrlTail}${pagePath}`,
    openGraph:{
      title: ogTitle,
      description: ogDescription?ogDescription:siteMiniDescription,
     
      url:`${siteUrlTail}${pagePath}`,
      images: imageName?[
        {
          url:`${siteUrlTail}/images/${imageName}`,
         
          alt: siteName,
          type: 'image/png',
        } 
    ]:null,
    },
    twitter: {
      handle: '@handle',
      site: '@site',
      cardType: 'summary_large_image',
      title: ogTitle,
      image:imageName?`${siteUrlTail}/images/${imageName}`:null,
    },
    nofollow: noFollow,
    noindex: noIndex
  }

}






export default {
    titleTemplate: `%s - ${siteName}`,
      defaultTitle: siteName,
    
   
      description: "As graduation loomed, we collectively decided to channel our passion into something greater, the Gamebuff! Our mission is promoting the amazing gaming night experience with friends, and enhancing that experience by providing exceptional gaming equipment. Join us in utilizing technology to create the sureally joyful experience noone has ever had a chance to experience throughout history. Happy shopping!",
      themeColor: "#02050a",
    openGraph: {
      type: 'website',
      
      url: 'https://selling-game-items-next.vercel.app/',
      siteName: siteName,
      title: siteName,
      description: siteMiniDescription,
      images: [
        {
        url: 'https://selling-game-items-next.vercel.app/images/gameGirl2.png',
      width: 737,
      height: 737,
      alt: siteName,
      type: 'image/png',
        }
      ]
      
    
      
    },
    twitter: {
      handle: '@handle',
      site: '@site',
      cardType: 'summary_large_image',
      title: siteName,
      description: siteMiniDescription,
      image: 'https://selling-game-items-next.vercel.app/images/gameGirl2.png',
    },
    canonical: `${siteUrlTail}/`,
  };

  export function productPageSeo(productId){

   
    const product = products.find((p) => {
      return p.id == productId;
    });

    return createPageSeo(product.name, product.description, `/products/${product.id}`, product.images[0], product.name, null, null, null);


  }

  export function collectionPageSeo(pagePath){
 
    const collection = collections.find((collection) => {
     return collection.name.toLowerCase().replace(/ /g, "-") == pagePath.split('/')[2] ;
    });

    const title = `${collection.name} - Page ${pagePath.split('/')[4]}`

    return createPageSeo(title, collection.description, pagePath, 
    collection.image, title, collection.description, null, null);








  }

  export function unimportantPageSeo(pagePath){


    
    const titleUncapitalized = pagePath.split('/')[1].replace(/-/g, ' ')
    const title = titleUncapitalized.charAt(0).toUpperCase() + titleUncapitalized.slice(1);
    
    const description = pagePath==='/collections'?siteMiniDescription:null
 
    const noFollow = (pagePath.includes('checkout') || pagePath.includes('policy') || pagePath.includes('terms-of-service'|| pagePath==='/404'))?true:null;
    const noIndex = (noFollow ||
    pagePath.includes('/products') || pagePath === '/cart' || pagePath === '/faq' || pagePath ==='/contact-us' || pagePath==='/thank-you')?true:null;
  
  
    return createPageSeo(title, description, pagePath, null, title, null, noFollow, noIndex);


   
  }




  export function ourStorySeo(description){
  
      return {
        title: 'Our story',
        description: description,
        url:`https://selling-game-items-next.vercel.app/our-story`,
   
        openGraph: {
          type: 'website',
          
          url: 'https://selling-game-items-next.vercel.app/our-story',
          siteName:  siteName,
          title: siteName,
          description: description,
          images: [
            {
            url: 'https://selling-game-items-next.vercel.app/images/gamingFriends2.png',
        
          alt: siteName,
          type: 'image/png',
            }
          ]
          
        
          
        },
        twitter: {
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
          title: `${siteName} - our story`,
          description: 'Buy perfect equipment for deep-night gaming',
          image: 'https://selling-game-items-next.vercel.app/images/gamingFriends2.png',
        },
        canonical: 'https://selling-game-items-next.vercel.app/',
      }
    




  }


  // noindex, but title: pages,  cart, thankyou, faq, contactus,
  
  //collectionPages, collections seo, our-story, ...
  //Odraditi finalnu funkciju u koju cu da ubacim ime stranice, a ono ce da pokrene jednu od funkcija gore



