import React, { useRef, useEffect } from 'react';

import EmailEditor from 'react-email-editor';

import styles from './emaileditor.module.css'



const EasyEmailEditor = ({setFinalPreview, setPreviewHtml, setEditorDesign, editorDesign}) => {

const emailEditorRef = useRef();


const handleSaveMainTemplate = async() => {



  await emailEditorRef.current?.editor?.exportHtml(async(data) => {

    const userResponse = confirm('Current main template will be overriden. Proceed?');

    if (!userResponse) {
     return;
    } 


    const { design } = data;

    if(!design) return;


  await fetch("/api/admincheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType: 'send_new_main_email_template', data: {designJson: JSON.stringify(design)} }),
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
      
      }
    })

    .catch((error) => {console.log(error)});

})

};



const handleLoadMainTemplate = async() => {


  
  const userResponse = confirm('Current progress will be lost. Proceed?');

  if (!userResponse) {
   return;
  } 



try{

 const response = await fetch("/api/admincheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType: 'get_main_email_template'}),
  })

  if(response.ok){
    console.log(response);
    const data = await response.json();
    

    const editorDesign = data?.data[0].designJson && JSON.parse(data?.data[0].designJson);

    emailEditorRef.current?.editor.loadDesign(editorDesign)
  }
  


}

catch(error){
  console.log('Main email tamplate loading unsuccessful.', error)
}






};











    const handleUploadHTML = () => {
        
        
        emailEditorRef.current?.editor?.exportHtml((data) => {
            const { design, html } = data;

            if(!html) return;
            
            
            setEditorDesign(design);

            const optimizedHtml = html.replace(/<!--[\s\S]*?-->/g, '')
            .replace(/(?<!min-)width[^'"\`;]*?px.*?;|max-width[^'"\`;]*?px.*?;/gi, '');

            console.log('html', optimizedHtml);

            setPreviewHtml(optimizedHtml);
            setFinalPreview(true)
          });
        };
      
     



   return <>
   
   <div className={styles.templateButtons}>
    <button onClick={handleSaveMainTemplate}>Save as main template</button>
    <button onClick={handleLoadMainTemplate}>Load main template</button>
   </div>
   <EmailEditor style={{ maxWidth:"none", minHeight: '980px', border: '1px solid #ccc' }} ref={emailEditorRef} 

  onReady={()=>{
    if(editorDesign){
        emailEditorRef.current?.editor.loadDesign(editorDesign)
        
    }
  }}

    options={
      {
        appearance:{
          theme:"modern_dark"
        },
        safeHtml: true,

        tools: {
            // Enabling various tools
            text: { enabled: true },
            image: { enabled: true },
            divider: { enabled: true },
            social: { enabled: true },
            button: { enabled: true },
            html: { enabled: true },
            spacer: { enabled: true },
            unsubscribe: { enabled: true },
            // Add more tools as needed
          },

      }
    }
     
     
     
     />

     <button className={styles.continueToPreviewButton} onClick={handleUploadHTML}>Continue to email preview</button>

</>

}

export default EasyEmailEditor;