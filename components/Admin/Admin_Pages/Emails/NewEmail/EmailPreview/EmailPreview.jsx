


import React, { useRef } from 'react';

import  { useState } from 'react'

import ReactHtmlParser from "react-html-parser";



import styles from './emailpreview.module.css'
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import { useAdminStore } from '@/components/Admin/AdminZustand';


const EmailPreview = ({previewHtml, setPreviewHtml}) => {

  const [emailTitle, setEmailTitle] = useState('');


    
  const emailTextRef=useRef();
  const [previewEmailContent, setPreviewEmailContent]= useState();


  const {setEmailDataUpdate} = useAdminStore();

  


  


    const handlePreviewEmail = () => {
      const finalHtml = emailTextRef.current.value;
    
      try {
        setPreviewEmailContent(ReactHtmlParser(finalHtml));
      } catch (error) {
        console.error('Error parsing HTML:', error);
        setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
      }
    };


    const handleSaveEmail = async()=>{


      if (!emailTitle || !emailTextRef.current.value) return;

      const newEmailData = { title: emailTitle, text: emailTextRef.current.value };


    
      try {
        const response = await fetch("/api/admincheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataType: "insert_new_email", data: newEmailData }),
        });
    
        if (response.ok) setEmailDataUpdate(true);
      } catch (error) {
        console.log(error);
      }
    }


    const backToEditor = async()=>{


       if (!await adminConfirm('Manual changes will be lost. Proceed?')) return;
  
       
       
       
  setPreviewHtml(prev => ({...prev, final: false}));

  

    }
  
    


   return <>
   
   <button onClick={backToEditor} className={styles.backToEditorButton}>Back to editor</button>
 
 
    <div className={styles.instructionsWrapper}>


    <span>{`- You can code fixed width or height where needed(like on buttons).`} </span>

   <span>{`- You can code additional css properties like box-shadow.`} </span>

   <span>{`- You can code additional support for different @media screen sizes(like font-size).`}</span>


   </div>

  
     
     
        
        
        <div className={styles.emailContentDiv}>
        <input value={emailTitle} onChange={(event)=>{setEmailTitle(event.target.value)}} className={styles.titleInput} placeholder='Email title...'/>

        <textarea
        ref={emailTextRef}
        defaultValue={previewHtml.html}
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

        <button onClick={handlePreviewEmail}>Preview Email</button>
        <button onClick={handleSaveEmail}>Save Email</button>
        </div>
        
      </div>

     { previewEmailContent && <div className={styles.previewContent}>
        {previewEmailContent}
      </div> }
        
        </>

}

export default EmailPreview;