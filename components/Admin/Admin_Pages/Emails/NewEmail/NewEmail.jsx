

import { useEffect, useRef, useState } from 'react';
import EasyEmailEditor from './EmailEditor/EmailEditor';
import EmailPreview from './EmailPreview/EmailPreview'
import styles from './newemail.module.css'

import { useRouter } from 'next/router';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import { useNewEmailStore } from './NewEmailZustand';


export default function NewEmail() {


  
    const {previewHtml, setPreviewHtml, editorDesign, setEditorDesign, emailFontValue, setEmailFontValue, emailWidthMode, setEmailWidthMode, mainBackgroundColor, setMainBackgroundColor } = useNewEmailStore();
  

    

 const routerConfirmPassedRef = useRef(false);




 const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {

    
      
        if(!previewHtml.html)return;
     
        if(!routerConfirmPassedRef.current){

          adminConfirm("Your progress will be lost. Leave anyway?").then((confirmed)=>{
            if(confirmed) {
              routerConfirmPassedRef.current = true;
              router.push(url);
            }
          })

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
