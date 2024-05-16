import React, { useLayoutEffect, useState } from 'react'

import styles from './productdescription.module.css'

import ReactHtmlParser from "react-html-parser";

export default function ProductDescription({description}) {


    const [produectDescription, setProductDescription]= useState("");


    useLayoutEffect(()=>{

        try{
            setProductDescription(ReactHtmlParser(description))
        }
        catch(error){
            setProductDescription(description)
        }

    },[description])

    // if (Array.isArray(parsedHtml) && parsedHtml.every(React.isValidElement)) {
    //   setPreviewDescription(parsedHtml);
    // }
  




  return (
    <div className={styles.descriptionDiv}>{produectDescription}</div>
  )
}
