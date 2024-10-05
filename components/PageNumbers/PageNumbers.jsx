
import Link from 'next/link';
import styles from './pagenumber.module.css'
import { ArrowDown } from '@/public/images/svgs/svgImages';


export default function PageNumber({ mainLink, links, pageId}){



    return  <div className={styles.linkDiv}>
    {pageId > 1 && (
      <Link
        href={mainLink === '/products/page/' && pageId === 2 ? '/products/' : `${mainLink}${pageId - 1}`}
        className={`${styles.pageLink} ${styles.arrowLink}`}
      >
        <ArrowDown styleClassName={styles.rightArrowImg} />
      </Link>
    )}
    {links?.length > 1 &&
      links?.map((link, index) => (
        <Link
          key={index}
          className={`${styles.pageLink} ${pageId === link ? styles.currentPageLink : ''}`}
          href={mainLink === '/products/page/' && link === 1 ? '/products/' : `${mainLink}${link}`}
        >
          {link}
        </Link>
      ))}
    {pageId < links?.length && (
      <Link
        href={`${mainLink}${pageId + 1}`}
        className={`${styles.pageLink} ${styles.arrowLink}`}
      >
        <ArrowDown styleClassName={`${styles.leftArrowImg} ${styles.rightArrowImg}`} />
      </Link>
    )}
  </div>
}