

import { useEffect, useState } from 'react';
import EasyEmailEditor from './EmailEditor/EmailEditor';
import EmailPreview from './EmailPreview'
import styles from './newemail.module.css'

import { useRouter } from 'next/router';

export default function NewEmail() {

 const [finalPreview, setFinalPreview] = useState(false);
 const [previewHtml,  setPreviewHtml] = useState();
 const [editorDesign, setEditorDesign]= useState();
 const [emailFontValue, setEmailFontValue] = useState("");
 const [emailWidthMode, setEmailWidthMode] = useState('clear_max_width');
 const [mainBackgroundColor, setMainBackgroundColor]= useState(`#000000`);


 const [emailTitle, setEmailTitle] = useState('');


 const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!window.confirm("Your progress will be lost. Leave anyway?")) {
        router.events.emit('routeChangeError');
        throw 'Route change aborted.';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  
  


  return (
    <div className={styles.mainDiv}>
      <h1>New email</h1>

      {finalPreview?<EmailPreview previewHtml={previewHtml} setFinalPreview={setFinalPreview}
        emailTitle={emailTitle}
        setEmailTitle={setEmailTitle}
        />:
      <EasyEmailEditor setFinalPreview={setFinalPreview}  setPreviewHtml={ setPreviewHtml} 
      editorDesign={editorDesign} setEditorDesign={setEditorDesign} 
      emailFontValue={emailFontValue} setEmailFontValue={setEmailFontValue}
      emailWidthMode={emailWidthMode} setEmailWidthMode={setEmailWidthMode}
      mainBackgroundColor={mainBackgroundColor} setMainBackgroundColor={setMainBackgroundColor}
      />}
      
    

    
    </div>
  )
}
