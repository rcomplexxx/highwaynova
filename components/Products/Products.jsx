
import GridCard from "../Cards/GridCard/GridCard";
import Product from "./Product/Product";



const Products = ({ products, partlyShown, gridTitle }) => {
 

  return (
   
   <GridCard partlyShown={partlyShown && products.length >= 6} gridTitle={gridTitle}>
        {products?.map((product, i) => (
          <Product key={i} product={product} />
        ))}
    </GridCard>

  );
};

export default Products;
