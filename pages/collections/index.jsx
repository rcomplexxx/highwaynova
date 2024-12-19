
import collections from "@/data/collections.json";
import Link from "next/link";
import styles from "./collections.module.css";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { collectionsPageSeo, unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import GridCard from "@/components/Cards/GridCard/GridCard";

export default function Collections({ collections}) {
  return (
    <>
     
     <NextSeo {...unimportantPageSeo('/collections')}/>








    <GridCard gridTitle={'Collections' }>


    {collections.map((collection, i) => (
        
        <div key={i} className={styles.root}>
        <Link href={"collection/" + collection.name.toLowerCase().replace(/ /g, '-')+'/page/1'}>

        
          <div className={styles.media}>
           
           
<Image
        height={0}
        width={0}
        src={`/images/` + collection.image} // Path to your image from the `public` directory
        alt="Example Image"
        className={`${styles.productImage}`}
        sizes="(max-width: 480px) 90vw,(max-width: 600px) 80vw, (max-width: 900px) 45vw, 25vw"
        priority={true}
      
      />



          </div>
        </Link>
     
          <span className={styles.cardContentText}>{collection.name}</span>
         
       
  
      
      </div>

        ))}
    </GridCard>



   
   



   
    </>
  );
}





export async function getStaticProps() {

  return {
    props: {
        collections: collections,
    
    },
  };
}









