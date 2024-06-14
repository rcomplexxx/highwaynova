
import styles from './productdescription.module.css'

import ReactHtmlParser from "react-html-parser";
import Image from 'next/image';

export default function ProductDescription({description}) {

  


  const options = {
    transform: (node) => {
      // Replace <img> tags with Next.js <Image> components
      if (node.name === 'img') {
        return (
          <Image
            src={node.attribs.src}
            alt={node.attribs.alt}
            className={node.attribs.class}
           
            width={0} // set your desired width
            height={0} // set your desired height
            sizes="(max-width: 600px) 100vw, 512px"
          />
        );
      }
    }
  };

 


  
  // import parse from 'html-react-parser';
  // import Image from 'next/image';
  // const replaceImgWithNextImage = () => {
  //   return parse(description, {
  //     replace: (domNode) => {
  //       if (domNode.name === 'img') {
  //         const { src, alt, class: className } = domNode.attribs;
  //         return <Image src={src} alt={alt} className={className} width={0} height={0} sizes="(max-width: 600px) 100vw, 512px" />;
  //       }
  //     },
  //   });
  // };





  return (
    <div className={styles.descriptionDiv}>
      <div className={styles.mainSpan}>Product details</div>

      {ReactHtmlParser(description, options)}</div>
  )
}
