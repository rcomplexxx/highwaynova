import { useEffect} from "react";
import { useRouter } from "next/router";
import products from "../../../data/products.json";
import Products from "@/components/Products/Products.jsx";
import Link from "next/link";
import styles from "./page.module.css";
import Head from "next/head";
import Image from "next/image";
import PageNumber from "@/components/PageNumbers/PageNumbers";
import { NextSeo } from "next-seo";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";

const ProductPage = ({  pageId, products, links }) => {
  // Redirect to home page if no product

  const router = useRouter();

  useEffect(() => {
    if (pageId === 1) {
      router.push("/products"); // Perform the redirect
    }
  }, [pageId]);

  if (pageId === 1) return null;

  //

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
  const pagesArray = [];

  for (let i = 0; i < Math.floor(productLength / 12) + 1; i++) {
    pagesArray.push({ params: { pageId: (i + 1).toString() } });
  }

  return { paths: pagesArray, fallback: false };
}

export async function getStaticProps(context) {
  const pageId = parseInt(context.params.pageId, 10);
  const productLength = products.length;
  let productArray =
    (pageId - 1) * 12 > productLength
      ? null
      : pageId * 12 > productLength
      ? products.slice((pageId - 1) * 12, productLength)
      : products.slice((pageId - 1) * 12, pageId * 12);

  const links = [];
  const totalPageNumber = Math.ceil(productLength / 12);

  for (let i = 1; i <= totalPageNumber; i++) {
    links.push(i);
  }

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
