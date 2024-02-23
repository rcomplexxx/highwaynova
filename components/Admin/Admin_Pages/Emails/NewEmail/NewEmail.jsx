import React, { useRef, useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import styles from './newemail.module.css'
import { Router, useRouter } from 'next/router';

export default function NewEmail() {

    const titleRef = useRef();
    const emailTextRef=useRef();
    const [previewEmailContent, setPreviewEmailContent]= useState();

    console.log('PreviewContent', previewEmailContent);
    const router = useRouter();

    const handlePreviewEmail = ()=>{
        try {
            // Attempt to parse the HTML
            const parsedHtml = ReactHtmlParser(emailTextRef.current.value);
        
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
      let newEmailData = {title:titleRef.current.value, text:emailTextRef.current.value };

    
     
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
        <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview Email</button>
      </div>

     { previewEmailContent && <><div className={styles.previewContent}>
        {previewEmailContent}
      </div> <button onClick={handleSaveEmail} className={`${styles.previewButton} ${styles.saveButton}`}>Save Email</button></>}
    </div>
  )
}
