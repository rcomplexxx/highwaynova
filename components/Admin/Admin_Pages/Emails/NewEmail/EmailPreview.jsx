


import React, { useRef, useEffect } from 'react';

import  { isValidElement,  useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import { Router, useRouter } from 'next/router';

import styles from './newemail.module.css'


const EmailPreview = ({previewHtml, setFinalPreview}) => {


    
  const titleRef = useRef();
  const emailTextRef=useRef();
  const [previewEmailContent, setPreviewEmailContent]= useState();

    const router = useRouter();


    useEffect(()=>{

      emailTextRef.current.value = previewHtml;
    },[])




    const handlePreviewEmail = ()=>{
        try {

          const finalHtml= emailTextRef.current.value;

            // Attempt to parse the HTML
            const parsedHtml = ReactHtmlParser(finalHtml);
            
        
            // if (Array.isArray(parsedHtml) && parsedHtml.every(isValidElement)) 
            //   {
                setPreviewEmailContent(parsedHtml);
              // } else {
              //   // Handle the case where parsing did not result in valid React elements
              //   setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
              // }
          } catch (error) {
            // Handle the error (e.g., log it, display an error message, etc.)
            console.error('Error parsing HTML:', error);
        
            // Perform a specific action when there is an error in HTML text
            setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
          }
    }


    const handleSaveEmail = async()=>{


      if(titleRef.current.value=='' || emailTextRef.current.value=='')return;


      const finalHtml= emailTextRef.current.value;

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


    const backToEditor = ()=>{


      const userResponse = confirm('Manual changes will be lost. Proceed?');

if (userResponse) {
  setFinalPreview(false)
} 

    }
  
    


   return <>
   
   <button onClick={backToEditor} className={styles.backToEditorButton}>Back to editor</button>
   <div className={styles.emailHelperWrapper}>
   <span className={styles.emailMakerInstructionSpan}>{`Must do: Add your own font!!!`}
   </span>

   <span className={styles.emailMakerInstructionSpan}>{`Must do: Oslobodi se max-widthova!!!`}
   </span>
      <span className={styles.emailMakerInstructionSpan}>{`Note: It's suggested to put images in /public/images/email/email_$emailId.`}
      </span>
      <div className={styles.featuresWrapper}>
          <span>Handy options</span>
        <button className={`${styles.getCurrentDescrition} ${styles.featureButton}`} 
        onClick={(event)=>{ 
          navigator.clipboard.writeText(`
            <html>\n\n<head>\n<style>\n.descriptionWrapper{\nwidth:100%;\ndisplay:flex;\nflex-direction: column;\nfont-size: 16px;\n}\n</style>\n</head>
            \n\n<body>\n\n<div class="descriptionWrapper">\n\n</div>\n\n</body>\n\n</html>`);
          event.target.innerText="Standard html content COPIED!"
        }}>Copy standard html description content</button>
        

       
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




        <div className={styles.newEmailButtons}>

        <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview Email</button>
        <button onClick={handleSaveEmail} className={`${styles.previewButton} ${styles.saveButton}`}>Save Email</button>
        </div>
        
      </div>

     { previewEmailContent && <><div className={styles.previewContent}>
        {previewEmailContent}
      </div> </>}
        
        </>

}

export default EmailPreview;