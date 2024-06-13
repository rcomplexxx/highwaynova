import  { useLayoutEffect, useState } from 'react'

import styles from './productdescription.module.css'

import ReactHtmlParser from "react-html-parser";
import Image from 'next/image';

export default function ProductDescription({description}) {

  


  // const options = {
  //   transform: (node) => {
  //     // Replace <img> tags with Next.js <Image> components
  //     if (node.type === 'tag' && node.name === 'img' && node.attribs) {
  //       return (
  //         <Image
  //           src={node.attribs.src}
  //           alt={node.attribs.alt || ''}
  //           className={node.attribs.class || ''}
  //           layout='responsive'
  //           width={0} // set your desired width
  //           height={0} // set your desired height
  //           sizes="(max-width: 980px) 10px, 100vw"
  //         />
  //       );
  //     }
  //   }
  // };

  //, options





  return (
    <div className={styles.descriptionDiv}>
      <div className={styles.mainSpan}>Product details</div>

      {ReactHtmlParser(description)}</div>
  )
}
