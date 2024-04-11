import Image from "next/image";
import styles from "./pageindexbuttons.module.css";
import { useCallback } from "react";

export default function PageIndexButtons({ data, page, setPage }) {
  if (data.length == 0) return;




  const getPageNumbersArray = useCallback(()=>{
   
      const max = Math.ceil(data.length / 10);

      
      if(max<18) return Array.from({ length: Math.ceil(data.length / 10) }, (_, index) =>  index);
      else {
        console.log('act', page)
        if(page<9)return Array.from({ length: 18 }, (_, index) =>  index);
        else if(max-page<9)return Array.from({ length: 18 }, (_, index) => max - 18 + index);
        else return Array.from({ length: 18 }, (_, index) => {return page - 9 + index});
      }
  },[page])


  return (
    <div className={styles.linkDiv}>
      {page !== 0 && (
        <div
          className={styles.linkDivPageNumber}
          onClick={() => setPage(page - 1)}
        >
          <span className={styles.arrowSpan}>
            <Image
              src={"/images/greater.svg"}
              alt="Black"
              className={styles.leftArrowImg}
              fill
            />
          </span>
        </div>
      )}
      {getPageNumbersArray().map((pageNumber, i) =>
        page === pageNumber ? (
          <span key={i} className={styles.linkDivPageNumber}>
            <div className={styles.pageLink}>
              {pageNumber+1}
            </div>
          </span>
        ) : (
          <div
            key={i}
            className={styles.linkDivPageNumber}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber+1}
          </div>
        ),
      )}
      {page !== Math.ceil(data.length / 10) - 1 && (
        <div
          className={styles.linkDivPageNumber}
          onClick={() => setPage(page + 1)}
        >
          
          <span className={styles.arrowSpan}>
            <Image src={"/images/greater.svg"} alt="Black" fill />
          </span>
        </div>
      )}
    </div>
  );
}
