import Products from "@/components/Products/Products.jsx";
import collections from "@/data/collections.json";
import products from "@/data/products.json";


import PageNumber from "@/components/PageNumbers/PageNumbers";
import styles from "./collectionpage.module.css";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { collectionPageSeo } from "@/utils/SEO-configs/next-seo.config";

export default function Collection({
  collectionName,
  collectionFullName,
  collectionImage,
  collectionDescription,
  pageId,
  products,
  links,
}) {
  return (
    <div className={styles.mainDiv}>
      <NextSeo {...collectionPageSeo(`/collection/${collectionName}/page/${pageId}`)}/>
      
      {/* <Products showAll={true} products={products}></Products> */}

      <div className={styles.collectionInfo}>


        <div className={styles.collectionText}>
          <h1 className={styles.collectionName}>{collectionFullName}</h1>
          <span className={styles.collectionDescription}>
            {collectionDescription}
          </span>
        </div>
     
    
          <Image
            src={`/images/${collectionImage}`}
            priority={true}
          
            sizes="40vw"
            alt="Cool image"
            className={styles.collectionImage}
            width={0}
            height={0}
          />
       
      </div>

     
     
      
        <Products showAll={true} products={products} />
        <PageNumber
          mainLink={`/collection/${collectionName}/page/`}
          links={links}
          pageId={pageId}
        />
     
     
    </div>
  );
}

export async function getStaticPaths() {
  const paths = collections.reduce((acc, collection) => {
    const pages = Math.floor(collection.products.length / 6) + 1;

    let collectionPaths = [];
    for (let i = 1; i < pages + 1; i++) {
      collectionPaths.push({
        params: {
          collectionName: collection.name.toLowerCase().replace(/ /g, "-"),
          pageId: i.toString(),
        },
      });
    }

    return acc.concat(collectionPaths);
  }, []);

  return {
    paths,
    fallback: false, // Or true if you want to handle undefined paths
  };
}

export async function getStaticProps({ params }) {
  const collection = collections.find(
    (c) => c.name.toLowerCase().replace(/ /g, "-") === params.collectionName
  );

  let collectionProducts = products.filter((p) => {
    return collection.products.includes(p.id);
  });

  const totalPageNumber = Math.floor(collectionProducts.length / 6);

  const pageId = parseInt(params.pageId, 10);

  collectionProducts = collectionProducts.slice((pageId - 1) * 6, pageId * 6);

  const links = [];

  for (let i = 1; i <= totalPageNumber; i++) {
    links.push(i);
  }

  return {
    props: {
      pageId: pageId,
      products: collectionProducts,
      links,
      collectionName: params.collectionName,
      collectionFullName: collection.name,
      collectionImage: collection.image,
      collectionDescription: collection.description,
    },
  };
}
