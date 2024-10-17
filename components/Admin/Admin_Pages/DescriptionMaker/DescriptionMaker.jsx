import  { isValidElement, useRef, useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import styles from './descriptionmaker.module.css'

import productsData from "@/data/products.json";

import Swal from 'sweetalert2';


export default function DescriptionMaker() {

 
    const descriptionTextRef=useRef();
    const descriptionCssTextRef=useRef();

    const [previewDescription, setPreviewDescription]= useState();

    const [descriptionGetterProductId, setDescriptionGetterProductId]=useState();
    const [productId, setProductId] = useState("");
    

    console.log('PreviewContent', previewDescription);

    
    const showError = (message) => {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
          confirmButtonText: 'Okay',
          background: '#333', // Dark background color
          color: '#fff', // Text color
          customClass: {
              popup: 'dark-popup', // Custom class for the popup
              title: 'dark-title', // Custom class for the title
              icon: 'dark-icon', // Custom class for the icon
              confirmButton: 'dark-confirm-button' // Custom class for the button
          }
      });
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

        //parsing html
        const finalHtml = `<style>${descriptionCssTextRef.current.value}</style>${descriptionTextRef.current.value}`;
        const parsedHtml = ReactHtmlParser(finalHtml);
    
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

    if (!productId) return showError("Product id isn't specified.");
    if (!descriptionTextRef.current.value) return showError("Description can't be empty.");
    if (!window.confirm('Do you want to proceed with replacing the current description with the new one?')) return;

  const finalHtml = `<style>${descriptionCssTextRef.current.value}</style>${descriptionTextRef.current.value}`;
  const newDescriptionData = { text: finalHtml, productId };

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'update_new_product_description', data: newDescriptionData })
    });

    if (response.ok) {
      
      cleanDescriptionMaker();
    }
  } catch (error) {
    console.error(error);
  }
};





  return (
  <>
  <h1>Description Maker</h1>
  <div className={styles.mainDiv}>
    <div className={styles.descriptionMakerInstructionSpan}>
      <p>Get the current product description if it exists by entering the product ID and clicking "Get current description."</p>
      <p>It's suggested to write the description using HTML and CSS. Use preview to check for any HTML errors, as the description will be parsed as HTML.</p>
      <p>Store images in /public/images/description/product_$productId.</p>
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
          <button onClick={getCurrentDescription} className={styles.getCurrentDescrition}>
            Link product and get description
          </button>
        </>
      ) : (
        <>
          <span className={styles.newDescWarning}>
            New description will affect product ID: {descriptionGetterProductId}
          </span>
          <button
            onClick={()=>{ if (!window.confirm("Unsaved changes will be lost. Continue?")) return; cleanDescriptionMaker();}}
            className={`${styles.getCurrentDescrition} ${styles.unlinkProductButton}`}
          >
            Unlink product ID
          </button>
        </>
      )}

      <div className={styles.featuresWrapper}>
        <span>Handy options</span>
        <button
          className={`${styles.getCurrentDescrition} ${styles.featureButton}`}
          onClick={(e) => {
            navigator.clipboard.writeText(`<div class="descriptionWrapper">...</div>`);
            e.target.innerText = "HTML content COPIED!";
          }}
        >
          Copy standard HTML
        </button>
        <button
          className={`${styles.getCurrentDescrition} ${styles.featureButton}`}
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
      <textarea ref={descriptionCssTextRef} className={`${styles.textArea} ${styles.textAreaCss}`} placeholder="Description CSS..." />
      <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview</button>
    </div>

    {previewDescription && <div className={styles.previewContent}>{previewDescription}</div>}

   

    <button onClick={handleSaveDescription} className={styles.saveDescription}>Save description</button>
  </div>
</>
  )
}





