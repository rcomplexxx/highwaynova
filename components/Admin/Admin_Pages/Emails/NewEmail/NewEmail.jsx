

import { useEffect, useState } from 'react';
import EasyEmailEditor from './EmailEditor/EmailEditor';
import EmailPreview from './EmailPreview/EmailPreview'
import styles from './newemail.module.css'

import { useRouter } from 'next/router';

export default function NewEmail() {

  
 const [previewHtml,  setPreviewHtml] = useState({final: false, html: undefined});
 const [editorDesign, setEditorDesign]= useState();
 const [emailFontValue, setEmailFontValue] = useState("");
 const [emailWidthMode, setEmailWidthMode] = useState('clear_max_width');
 const [mainBackgroundColor, setMainBackgroundColor]= useState(`#000000`);




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

      {previewHtml.final?
      <EmailPreview previewHtml={previewHtml} setPreviewHtml={setPreviewHtml} />
      :
      <EasyEmailEditor  setPreviewHtml={ setPreviewHtml} 
      editorDesign={editorDesign} setEditorDesign={setEditorDesign} 
      emailFontValue={emailFontValue} setEmailFontValue={setEmailFontValue}
      emailWidthMode={emailWidthMode} setEmailWidthMode={setEmailWidthMode}
      mainBackgroundColor={mainBackgroundColor} setMainBackgroundColor={setMainBackgroundColor}
      />}
      
    

    
    </div>
  )
}
