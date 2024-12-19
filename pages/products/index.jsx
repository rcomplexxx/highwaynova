import Products from "@/components/Products/Products.jsx";
import products from "@/data/products.json";
import PageNumber from "@/components/PageNumbers/PageNumbers";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import getRatingData from "@/utils/utils-server/getRatingData";

export default function ProductPage({ products, links }) {
  return (
    <>
      <NextSeo {...unimportantPageSeo('/products')}/>
      <Products  products={products} gridTitle="Trending products"/>

      <PageNumber mainLink='/products/page/' links={links} pageId={1}/>
      
    </>
  );
}

export async function getStaticProps() {
  const totalPageNumber = Math.ceil(products.length / 12);
  const links = totalPageNumber > 1 ? [...Array(totalPageNumber).keys()].map(i => i + 1) : [];

  const productData = await Promise.all(
    products.slice(0, 12).map(async product => {
      const { rating, reviewsNumber } = await getRatingData(product.id);
      return { ...product, rating, reviewsNumber: reviewsNumber };
    })
  );

  return {
    props: { products: productData, links },
  };
}
