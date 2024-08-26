import Products from "@/components/Products/Products.jsx";
import products from "@/data/products.json";
import PageNumber from "@/components/PageNumbers/PageNumbers";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

export default function ProductPage({ products, links }) {
  return (
    <>
      <NextSeo {...unimportantPageSeo('/products')}/>
      <Products showAll={true} products={products} productListTitle="Trending products"/>

      <PageNumber mainLink='/products/page/' links={links} pageId={1}/>
      
    </>
  );
}

export async function getStaticProps() {
  const totalPageNumber = Math.ceil(products.length / 12);
  const links = [];
  if (totalPageNumber !== 1) {
    for (let i = 1; i <= totalPageNumber; i++) {
      links.push(i);
    }
  }

  return {
    props: {
      products: products.slice(0, 12),
      links: links,
    },
  };
}
