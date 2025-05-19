


import React, { useRef } from 'react';

import  { useState } from 'react'

import ReactHtmlParser from "react-html-parser";



import styles from './emailpreview.module.css'
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import { useAdminStore } from '@/components/Admin/AdminZustand';
import InstructionsWrapper from '../../../Admin_Home/InstructionsWrapper/InstructionsWrapper';
import { useNewEmailStore } from '../NewEmailZustand';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';


const EmailPreview = ({previewHtml, setPreviewHtml}) => {

  const [emailTitle, setEmailTitle] = useState('');


    
  const emailTextRef=useRef();
  const [previewEmailContent, setPreviewEmailContent]= useState();


  const {setEmailDataUpdate} = useAdminStore();

  const {setIsEmailFinished} = useNewEmailStore();

  


  


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


      if(!emailTitle) return adminAlert('error', 'No email title', 'Please provide email title.');


      if (!emailTextRef.current.value) return adminAlert('error', 'No email text', 'Please provide email text.');

      const newEmailData = { title: emailTitle, text: emailTextRef.current.value };


    
      try {
        const response = await fetch("/api/admincheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataType: "insert_new_email", data: newEmailData }),
        });
    
        if (response.ok) {
          setIsEmailFinished(true);
          setEmailDataUpdate(true);
        
        }
      } catch (error) {
        console.log(error);
      }
    }




    const backToEditor = async()=>{
       if (!await adminConfirm('Manual changes will be lost. Proceed?')) return;
      setPreviewHtml(prev => ({...prev, final: false}));

    }
  

    
    


   return <>
   

   <div className={styles.interfaceDiv}>
  
 

 <InstructionsWrapper>

 <span>{`1. You can manually change email here.`}</span>
 <span>{`2. You can code fixed width or height where needed(e.g. buttons).`} </span>

<span>{`3. You can code additional css properties(e.g. box-shadow).`} </span>

<span>{`4. You can code additional support for different @media screen sizes(e.g. font-size).`}</span>

<span className={styles.instructionSpan}>{`4. Shortcut '[orderId]' can be typed as html text content, and will be replaced with customer's personalized order id on back-end before sending the email. ⚠️Works only for thank you sequence emails.`}</span>

<span className={styles.instructionSpan}>{`5. Click on Save Email to finally save it. Next step is to create new sequence(more details on '/emails/new-sequence').`}</span>
  </InstructionsWrapper>

  <button onClick={backToEditor} className={styles.backToEditorButton}>Back to editor</button>
 
 
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