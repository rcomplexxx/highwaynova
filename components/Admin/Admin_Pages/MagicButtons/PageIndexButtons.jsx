import Image from "next/image";
import styles from "./pageindexbuttons.module.css";
import { useCallback } from "react";
import { ArrowDown } from "@/public/images/svgs/svgImages";

export default function PageIndexButtons({ data, page, setPage, elementsPerPage=10 }) {



  if (!data.length) return;

  const getPageNumbersArray = useCallback(() => {
    const max = Math.ceil(data.length / elementsPerPage);
    
    if (max < 18) return Array.from({ length: max }, (_, index) => index);
    
    return page < 9 
      ? Array.from({ length: 18 }, (_, index) => index)
      : max - page < 9 
        ? Array.from({ length: 18 }, (_, index) => max - 18 + index)
        : Array.from({ length: 18 }, (_, index) => page - 9 + index);
  }, [page]);


 return (
  <div className={styles.linkDiv}>
    {page > 0 && (
      <div className={styles.linkDivPageNumber} onClick={() => setPage(page - 1)}>
        <ArrowDown color="var(--admin-neutral-1)" styleClassName={styles.arrow} />
      </div>
    )}

    {getPageNumbersArray().map((pageNumber, i) => (
      <div
        key={i}
        className={`${styles.linkDivPageNumber} ${page === pageNumber ? styles.pageLink : ''}`}
        onClick={page === pageNumber ? undefined : () => setPage(pageNumber)}
      >
        {pageNumber + 1}
      </div>
    ))}

    {page < Math.ceil(data.length / elementsPerPage) - 1 && (
      <div className={styles.linkDivPageNumber} onClick={() => setPage(page + 1)}>
        <ArrowDown
          color="var(--admin-neutral-1)"
          styleClassName={`${styles.arrow} ${styles.rightArrow}`}
        />
      </div>
    )}
  </div>
);
}
