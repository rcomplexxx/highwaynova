
import styles from './productdescription.module.css'

import ReactHtmlParser from "react-html-parser";
import Image from 'next/image';

export default function ProductDescription({description}) {

  


  const options = {
    transform: (node, index) => {
      // Replace <img> tags with Next.js <Image> components
      if (node.name === 'img') {
        return (
          <Image
          key={index}
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

 






  return (
    <div className={styles.descriptionDiv}>
      <div className={styles.mainSpan}>Product details</div>

      {ReactHtmlParser(description, options)}</div>
  )
}
