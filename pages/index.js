import HomeReviews from "@/components/HomeReviews/HomeReviews.jsx";
import Products from "@/components/Products/Products.jsx";
import products from "@/data/products.json";
import styles from "@/styles/home.module.css";
import Link from "next/link";
import Image from "next/image";

const HomePage = ({ products }) => {

// useEffect(()=>{
//   var s = document.getElementById("heroShopNow");

//   const parallax=()=> {
//     if(window.scrollY>window.innerHeight)return;
//   var yPos = -window.scrollY/20;  
//   var verticalShadow = 8-window.innerHeight/(window.innerHeight-window.scrollY)*8;
//   console.log('verSh', verticalShadow)
  
//   s.style.transform = `translateY(${yPos}px)` 
//   s.style.boxShadow= `0 ${2+verticalShadow}px 8px hsla(0, 0%, 0%, 0.8)`
// }

// window.addEventListener("scroll", parallax);
// return()=>{
//   window.removeEventListener("scroll", parallax)
// }

// },[])


  return (
    <>
   
   

      <picture className={styles.heroWindow}>
    <source media="(min-width: 720px)" srcSet="/images/motohero.jpeg" />
    <source media="(max-width: 720px)" srcSet="/images/motohero2.jpeg" />        
   
        <Image
          height={0}
          width={0}
         src={`/images/motohero.jpeg`} // Path to your image from the `public` directory
          alt="Hero Discount Image"
          priority={true}
          sizes="100vw"
        

          className={styles.heroImage}
        />
 



        <Link id='heroShopNow' href="/products" className={styles.linkButton}>
          Shop Now
        </Link>
        </picture>

      
     



      <div className={styles.content}>
     

        <Products showAll={false} products={products} productListTitle="Trending now" />
        <HomeReviews />
      </div>
    </>
  );
};

export async function getStaticProps() {
  // Return the data as props
  return {
    props: {
      products: products.slice(0, 6),
    },
  };
}

export default HomePage;
