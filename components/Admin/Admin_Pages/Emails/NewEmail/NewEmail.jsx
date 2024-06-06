import  { useRef, useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import styles from './newemail.module.css'
import { Router, useRouter } from 'next/router';

export default function NewEmail() {

    const titleRef = useRef();
    const emailTextRef=useRef();
    const emailCssTextRef = useRef();
    const [previewEmailContent, setPreviewEmailContent]= useState();

    console.log('PreviewContent', previewEmailContent);
    const router = useRouter();

    const handlePreviewEmail = ()=>{
        try {

          const finalHtml= `<style>${emailCssTextRef.current.value}</style>${emailTextRef.current.value}`

            // Attempt to parse the HTML
            const parsedHtml = ReactHtmlParser(finalHtml);
            
        
            if (Array.isArray(parsedHtml) && parsedHtml.every(React.isValidElement)) {
                setPreviewEmailContent(parsedHtml);
              } else {
                // Handle the case where parsing did not result in valid React elements
                setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
              }
          } catch (error) {
            // Handle the error (e.g., log it, display an error message, etc.)
            console.error('Error parsing HTML:', error);
        
            // Perform a specific action when there is an error in HTML text
            setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
          }
    }


    const handleSaveEmail = async()=>{


      if(titleRef.current.value=='' || emailTextRef.current.value=='')return;


      const finalHtml= `<style>${emailCssTextRef.current.value}</style>${emailTextRef.current.value}`

      let newEmailData = {title:titleRef.current.value, text:finalHtml };

    
     
        await fetch("/api/admincheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataType: 'send_new_email', data: newEmailData }),
        })
          .then((response) => {
            if (response.ok) {
              console.log(response);
              router.push('/admin/emails');
            }
          })
  
          .catch((error) => {console.log(error)});
    }


  return (
    <div className={styles.mainDiv}>
      <h1>New email</h1>

<div className={styles.emailHelperWrapper}>
      <span className={styles.emailMakerInstructionSpan}>{`Note: It's suggested to put images in /public/images/email/email_$emailId.`}
      </span>
      <div className={styles.featuresWrapper}>
          <span>Handy options</span>
        <button className={`${styles.getCurrentDescrition} ${styles.featureButton}`} 
        onClick={(event)=>{ 
          navigator.clipboard.writeText(`<div class="descriptionWrapper">\n\n</div>`);
          event.target.innerText="Standard html content COPIED!"
        }}>Copy standard html description content</button>
         <button className={`${styles.getCurrentDescrition} ${styles.featureButton}`} 
        onClick={(event)=>{ 
          navigator.clipboard.writeText(`.descriptionWrapper{\ndisplay:flex;\nflex-direction: column;\nfont-size: 16px;\n}`);
          event.target.innerText="Standard css content COPIED!"
        
        }}>Copy standard css description content</button>

       
        </div>

        </div>
      
    

      <div className={styles.emailContentDiv}>
        <input ref={titleRef} className={styles.titleInput} placeholder='Email title...'/>

        <textArea
        ref={emailTextRef}
        tabIndex={0}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className={styles.textArea}
        
        placeholder='Email html content...'
        onFocus={(event) => {
          event.target.style.height = event.target.scrollHeight + "px";
        }}
        />


<textArea
        ref={emailCssTextRef}
        tabIndex={0}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className={`${styles.textArea} ${styles.textAreaCss}`}
        
        placeholder='Define email css classes here...'
        onFocus={(event) => {
          event.target.style.height = event.target.scrollHeight + "px";
        }}
        />

        <div className={styles.newEmailButtons}>

        <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview Email</button>
        <button onClick={handleSaveEmail} className={`${styles.previewButton} ${styles.saveButton}`}>Save Email</button>
        </div>
        
      </div>

     { previewEmailContent && <><div className={styles.previewContent}>
        {previewEmailContent}
      </div> </>}
    </div>
  )
}
