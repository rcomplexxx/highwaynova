
import Image from 'next/image';
import styles from './productdescription.module.css'

import parse from "html-react-parser";

export default function ProductDescription({description}) {



  const options = {
    replace: ({ name, attribs, children }) => {
      if (name === 'img' && attribs) {
        // Return the Next.js Image component
        return (
          <Image
            src={attribs.src}
            alt={attribs.alt || ''}
            className={attribs.class || ''}
            height={0}
            width ={0}
            layout='responsive'
            sizes="(max-width: 980px) 40vw, 100vw"
          />
        );
      }
    }
  };





  return (
    <div className={styles.descriptionDiv}>{parse(description, options)}</div>
  )
}
