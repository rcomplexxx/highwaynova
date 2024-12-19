
import products from "@/data/products.json";
import Products from "@/components/Products/Products.jsx";


import PageNumber from "@/components/PageNumbers/PageNumbers";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import getRatingData from "@/utils/utils-server/getRatingData";

const ProductPage = ({  pageId, products, links }) => {
  // Redirect to home page if no product

 


  return (
    <>
      
      <NextSeo {...unimportantPageSeo(`/products/page/${pageId + 1}`)}/>
      <Products
      
      
        products={products}
        gridTitle= "Trending products"
      
      />
      <PageNumber mainLink='/products/page/' links={links} pageId={pageId}/>
    </>
  );
};



export async function getStaticPaths() {
  const productLength = products.length;
  const totalPages = Math.ceil(productLength / 12);
  
  let paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { pageId: (i + 1).toString() },
  }));

 

  return { paths, fallback: false };
}

export async function getStaticProps(context) {

  console.log('params', context.params)

 

    
  
  const pageId = parseInt(context.params.pageId, 10);
  const productLength = products.length;
  const totalPageNumber = Math.ceil(productLength / 12);
  const links = Array.from({ length: totalPageNumber }, (_, i) => i + 1);

  
  

  const productData = await Promise.all(
    products.slice((pageId - 1) * 12, pageId * 12).map(async product => {
      const { rating, reviewsNumber } = await getRatingData(product.id);
      return { ...product, rating, reviewsNumber };
    })
  );

  // Return the data as props
  return {
    props: {
     
      products: productData,
      pageId: pageId,
      links,
    },
  };
}

export default ProductPage;
