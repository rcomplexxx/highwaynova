import Link from "next/link";
import styles from './gridCard.module.css';



const GridCard = ({  partlyShown, gridTitle, children }) => {
 

    return (
      <div className={styles.mainDiv}>
  
  
        {gridTitle && <h1>{gridTitle}</h1>}
        <div className={styles.mainGridStyle}>
          {children}
        </div>
        {partlyShown && (
          <Link href="/products" className={styles.viewAllLink}>
            View All
          </Link>
        )}
        
      </div>
    );
  };



  export default GridCard;