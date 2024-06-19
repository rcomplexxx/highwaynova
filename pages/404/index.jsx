import Link from 'next/link';
import styles from'./404.module.css'
import { unimportantPageSeo } from '@/utils/SEO-configs/next-seo.config';
import { NextSeo } from 'next-seo';

const Custom404 = () => {
  return (
    <div className={styles.mainDiv}>
      <NextSeo {...unimportantPageSeo('/404')}/>
   
      <h1 className={styles.title404}>Page Not Found</h1>
      <span className={styles.notification404}>Oops, Something went wrong<br/>
We can't find the page you're looking for</span>
    
      <Link href='/collections' className={`${styles.shopNow} mainButton`}>Continue shopping</Link>
   
    </div>
  );
};

export default Custom404;

// The page you are looking for could not be found.