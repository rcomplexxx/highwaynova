import {useEffect, useState } from 'react'

import ReactHtmlParser from "react-html-parser";

import styles from './emailcard.module.css'
import { useRouter } from 'next/router';


export default function EmailCard({id,title, text, handleSaveEmail}) {

    const [emailTitle, setEmailTitle] = useState()
    const [emailTextHtml, setemailTextHtmlHtml] = useState();
    
    const [previewEmailContent, setPreviewEmailContent]= useState();






    useEffect(()=>{






      setEmailTitle(title);




    


        setemailTextHtmlHtml(text)
      







    },[id])











    const handlePreviewEmail = ()=>{
        try {
          


            const parsedHtml = ReactHtmlParser(emailTextHtml);
        
                setPreviewEmailContent(parsedHtml);
            
          } catch (error) {
            // Handle the error (e.g., log it, display an error message, etc.)
            console.error('Error parsing HTML:', error);
        
            // Perform a specific action when there is an error in HTML text
            setPreviewEmailContent(<div>An error occurred while parsing the HTML.</div>);
          }
    }



    const handleDeleteEmail = async()=>{


      if (!window.confirm("Are you sure you want to delete this email?")) return;


      try {
        const response = await fetch("/api/admincheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
           { dataType:'delete_email', data:{deleteId: id }} 
          ),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Maine DATA!", data);
         
          
  
         
         
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }


    }


   



  return (
  <>
      <div className={styles.emailContentDiv}>
     



<div className={styles.idDiv}> 
  
   <span className={styles.currentIdText}>email id:</span>
   <span className={styles.currentId}>{id}</span>
 </div>


        <input value={emailTitle} 
        onChange={(event)=>{setEmailTitle(event.target.value)}}
        className={styles.titleInput} placeholder='Email title...'/>

        <textarea
        value={emailTextHtml}
        onChange={(event)=>{setemailTextHtmlHtml(event.target.value)}}
        tabIndex={0}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className={styles.textArea}
        
        placeholder='Email html content...'
        onFocus={(event) => {
          event.target.style.height = event.target.scrollHeight + "px";
        }}
        />


        <div className={styles.buttonBar}>
        <button className={styles.previewButton} onClick={handlePreviewEmail}>Preview Email</button>
        {handleSaveEmail && <button onClick={()=>{handleSaveEmail(id, emailTitle, emailTextHtml)}} className={`${styles.previewButton} ${styles.saveButton}`}>Save Email</button> }
        <button className={`${styles.previewButton} ${styles.deleteEmail}`} onClick={handleDeleteEmail}>Delete Email</button>
       
        </div>
        { previewEmailContent && <><div className={styles.previewContent}>
        {previewEmailContent}
      </div> 
      </>} 
      </div>

    
     
      </>
  )
}
