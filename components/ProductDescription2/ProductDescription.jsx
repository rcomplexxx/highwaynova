import  { useLayoutEffect, useState } from 'react'

import styles from './productdescription.module.css'

import ReactHtmlParser from "react-html-parser";
import parse, { domToReact } from 'html-react-parser';
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

  


  const replaceImgWithNextImage = () => {
    return parse(description, {
      replace: (domNode) => {
        if (domNode.name === 'img') {
          const { src, alt, class: className } = domNode.attribs;
          return <Image src={src} alt={alt} className={className} width={0} height={0} sizes="(max-width: 600px) 100vw, 512px" />;
        }
      },
    });
  };





  return (
    <div className={styles.descriptionDiv}>
      <div className={styles.mainSpan}>Product details</div>

      {replaceImgWithNextImage()}</div>
  )
}
