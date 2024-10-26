import  { isValidElement, useRef, useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import styles from './descriptionmaker.module.css'

import productsData from "@/data/products.json";

import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';


export default function DescriptionMaker() {

 
    const descriptionTextRef=useRef();
    const descriptionCssTextRef=useRef();

    const [previewDescription, setPreviewDescription]= useState();

    const [descriptionGetterProductId, setDescriptionGetterProductId]=useState();
    const [productId, setProductId] = useState("");
    

    console.log('PreviewContent', previewDescription);

    
    const showError = (message) => {

      adminAlert('error', 'Error', message)
 
      
  };



    const getCurrentDescription = async () => {

      
      if (descriptionGetterProductId===undefined || isNaN(descriptionGetterProductId)) return;
    
      const product = productsData.find(product => descriptionGetterProductId === product.id);
      if (!product) return;

    
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType: "get_product_description", data: { productId: product.id } }),
      });
    
      if (!response.ok) return;
    
      const { data } = await response.json();

      console.log('hello!', data)
      
      if (!data || data.length === 0) {
        
      setProductId(descriptionGetterProductId);
        return;}
    
      
      const productDescription = data[0].description;
      if (!productDescription) return;
    
      if (productDescription.includes("</style>")) {
        const [css, description] = productDescription.split("</style>");
        descriptionTextRef.current.value = description;
        descriptionCssTextRef.current.value = css.substring(css.indexOf("<style>") + 7);
      } else {
        descriptionTextRef.current.value = productDescription;
      }
    
      
      setProductId(descriptionGetterProductId);
    };



    const cleanDescriptionMaker = () => {
     

      setPreviewDescription("");
      setDescriptionGetterProductId();
      setProductId("");
 
   
    descriptionTextRef.current.value = "";
    descriptionCssTextRef.current.value = "";

    
  
    
  }





    const handlePreviewEmail = () => {
      try {

        
        const parsedHtml = ReactHtmlParser(`<style>${descriptionCssTextRef.current.value}</style>${descriptionTextRef.current.value}`);
    
        if (Array.isArray(parsedHtml) && parsedHtml.every(isValidElement)) {
          setPreviewDescription(parsedHtml);
        } else {
          setPreviewDescription("An error occurred while parsing the HTML.");
        }
      } catch (error) {
        console.error('Error parsing HTML:', error);
        setPreviewDescription("An error occurred while parsing the HTML.");
      }
    };
    

   const handleSaveDescription = async () => {

    if (!productId && productId!==0) return showError("Product id isn't specified.");
    if (!descriptionTextRef.current.value) return showError("Description can't be empty.");
    if (!await adminConfirm('Do you want to proceed with replacing the current description with the new one?')) return;

  const finalHtml = `<style>${descriptionCssTextRef.current.value}</style>${descriptionTextRef.current.value}`;
  const newDescriptionData = { text: finalHtml, productId };

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'update_new_product_description', data: newDescriptionData })
    });

    if (response.ok) cleanDescriptionMaker();
    
  } catch (error) {
    console.error(error);
  }
};





  return (
  <>
  <h1>Description Maker</h1>
  <div className={styles.mainDiv}>
    <div className={styles.descriptionMakerInstructions}>
      <p>1. Link product and get current description</p>
      <p>2. Write description using HTML and CSS.</p>
      <p>3. Use preview to parse written code and check for any errors in final design.</p>
      <p>4. Store description images in /public/images/description/product_$productId.</p>
    </div>

    <div className={styles.getCurrentDescriptionWrapper}>
      {productId === "" ? (
        <>
          <input
            className={styles.inputProductId}
            value={descriptionGetterProductId}
            placeholder="Enter product ID"
            onChange={(e) => setDescriptionGetterProductId(Number(e.target.value))}
          />
          <button onClick={getCurrentDescription} >
            Link product and get description
          </button>
        </>
      ) : (
        <>
          <span>New description will affect product ID: {descriptionGetterProductId}</span>
          <button
            onClick={async()=>{ if (!await adminConfirm("Unsaved changes will be lost. Continue?")) return; cleanDescriptionMaker();}}
         
          >
            Unlink product ID
          </button>
        </>
      )}

      <div className={styles.featuresWrapper}>
        <span>Handy options</span>
        <button
          onClick={(e) => {
            navigator.clipboard.writeText(`<div class="descriptionWrapper">...</div>`);
            e.target.innerText = "HTML content COPIED!";
          }}
        >
          Copy standard HTML
        </button>
        <button
          onClick={(e) => {
            navigator.clipboard.writeText(`.descriptionWrapper {...}`);
            e.target.innerText = "CSS content COPIED!";
          }}
        >
          Copy standard CSS
        </button>
      </div>
    </div>

    <div className={styles.emailContentDiv}>
      <textarea ref={descriptionTextRef} className={styles.textArea} placeholder="Description HTML..." />
      <textarea ref={descriptionCssTextRef} className={styles.textArea} placeholder="Description CSS..." />
      <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview</button>
    </div>

    {previewDescription && <div className={styles.previewContent}>{previewDescription}</div>}

   

    <button onClick={handleSaveDescription}>Save description</button>
  </div>
</>
  )
}





