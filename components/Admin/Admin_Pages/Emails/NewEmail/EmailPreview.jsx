


import React, { useRef, useEffect } from 'react';

import  { useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import {useRouter } from 'next/router';

import styles from './newemail.module.css'
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';


const EmailPreview = ({previewHtml, setFinalPreview, emailTitle, setEmailTitle}) => {

    
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
            
        
          
                setPreviewEmailContent(parsedHtml);
          
          } catch (error) {
            // Handle the error (e.g., log it, display an error message, etc.)
            console.error('Error parsing HTML:', error);
        
            // Perform a specific action when there is an error in HTML text
            setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
          }
    }


    const handleSaveEmail = async()=>{


      if(emailTitle === '' || emailTextRef.current.value=='')return;


      const finalHtml= emailTextRef.current.value;

      let newEmailData = {title:emailTitle, text:finalHtml };

    
     
        await fetch("/api/admincheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataType: "insert_new_email", data: newEmailData }),
        })
          .then((response) => {

            console.log('save resp', response)
            if (response.ok) {
              console.log(response);
              router.push('/admin/emails');
            }
          })
  
          .catch((error) => {console.log(error)});
    }


    const backToEditor = async()=>{


       if (!await adminConfirm('Manual changes will be lost. Proceed?')) return;
  
       
       
  setFinalPreview(false)

  

    }
  
    


   return <>
   
   <button onClick={backToEditor} className={styles.backToEditorButton}>Back to editor</button>
   <div className={styles.emailHelperWrapper}>
    <div className={styles.instructionsWrapper}>


    <span className={styles.emailMakerInstructionSpan}>{`- You can code fixed width or height where needed(like on buttons).`}
    </span>

   <span className={styles.emailMakerInstructionSpan}>{`- You can code additional css properties like box-shadow.`}
   </span>

   <span className={styles.emailMakerInstructionSpan}>{`- You can code additional support for different @media screen sizes(like font-size).`}
   </span>


   </div>

  
     
        </div>
        
        
        <div className={styles.emailContentDiv}>
        <input value={emailTitle} onChange={(event)=>{setEmailTitle(event.target.value)}} className={styles.titleInput} placeholder='Email title...'/>

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