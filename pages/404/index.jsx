import Link from 'next/link';
import React from 'react';
import styles from'./404.module.css'
import Head from 'next/head';

const Custom404 = () => {
  return (
    <div className={styles.mainDiv}>
   
      <h1>Page Not Found</h1>
      <p className={styles.notification404}>Oops, Something went wrong<br/>
We can't find the page you're looking for</p>
    
      <Link href='/collections' className={styles.continueShopping}>
        <button className={styles.shopNow}>Continue shopping</button></Link>
   
    </div>
  );
};

export default Custom404;

// The page you are looking for could not be found.