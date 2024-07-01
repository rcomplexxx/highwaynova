

import { useState } from 'react';
import EasyEmailEditor from './EmailEditor/EmailEditor';
import EmailPreview from './EmailPreview'
import styles from './newemail.module.css'

export default function NewEmail() {

 const [finalPreview, setFinalPreview] = useState(false);
 const [previewHtml,  setPreviewHtml] = useState();
 const [editorDesign, setEditorDesign]= useState();
  
  


  return (
    <div className={styles.mainDiv}>
      <h1>New email</h1>

      {finalPreview?<EmailPreview previewHtml={previewHtml} setFinalPreview={setFinalPreview}/>:
      <EasyEmailEditor setFinalPreview={setFinalPreview}  setPreviewHtml={ setPreviewHtml} editorDesign={editorDesign} setEditorDesign={setEditorDesign}/>}
      
    

    
    </div>
  )
}
