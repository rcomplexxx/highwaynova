
import products from "../../../data/products.json";
import Products from "@/components/Products/Products.jsx";

import styles from "@/styles/productlist.module.css";

import PageNumber from "@/components/PageNumbers/PageNumbers";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

const ProductPage = ({  pageId, products, links }) => {
  // Redirect to home page if no product

 


  return (
    <div className={styles.mainDiv}>
      
      <NextSeo {...unimportantPageSeo(`/products/page/${pageId + 1}`)}/>
      <Products
        showAll={true}
        products={products}
        productListTitle= "Trending products"
      
      />
      <PageNumber mainLink='/products/page/' links={links} pageId={pageId}/>
    </div>
  );
};



export async function getStaticPaths() {
  const productLength = products.length;
  const totalPages = Math.ceil(productLength / 12);
  
  const paths = Array.from({ length: totalPages-1 }, (_, i) => ({
    params: { pageId: (i + 2).toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const pageId = parseInt(context.params.pageId, 10);
  const productLength = products.length;
  const totalPageNumber = Math.ceil(productLength / 12);
  
  const start = (pageId - 1) * 12;
  const end = Math.min(start + 12, productLength);
  const productArray = start >= productLength ? [] : products.slice(start, end);
  
  const links = Array.from({ length: totalPageNumber }, (_, i) => i + 1);

  // Return the data as props
  return {
    props: {
     
      products: productArray,
      pageId: pageId,
      links,
    },
  };
}

export default ProductPage;
