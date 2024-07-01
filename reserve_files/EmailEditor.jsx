import React, { useRef, useEffect } from 'react';

import EmailEditor from 'react-email-editor';



const EmailEditor = () => {

const emailEditorRef = useRef();

    const handleUploadHTML = (htmlContent) => {
        const unlayer = emailEditorRef.current?.editor;
        
        unlayer?.loadDesign({
          body: htmlContent,
        });
      };



   return <><EmailEditor style={{ maxWidth:"none", minHeight: '980px', border: '1px solid #ccc' }} ref={emailEditorRef} 

    options={
      {
        appearance:{
          theme:"modern_dark"
        },

        tools: {
          image: {
            enabled: true
          }
        },

      }
    }
     
     
     
     />

</>

}

export default EmailEditor;