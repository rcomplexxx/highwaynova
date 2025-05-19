

import { useEffect, useRef, useState } from 'react';
import EasyEmailEditor from './EmailEditor/EmailEditor';
import EmailPreview from './EmailPreview/EmailPreview'
import styles from './newemail.module.css'

import { useRouter } from 'next/router';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import { useNewEmailStore } from './NewEmailZustand';
import { useAdminStore } from '@/components/Admin/AdminZustand';


export default function NewEmail() {


  
    const {previewHtml, setPreviewHtml, initializeGlobalFont, isEmailFinished, zustandDataCleaning } = useNewEmailStore();
  
    const {emailDataUpdate} = useAdminStore();

    

 const routerConfirmPassedRef = useRef(false);




 const router = useRouter();


 useEffect(()=>{ initializeGlobalFont();

  return ()=>{
    zustandDataCleaning();
  }
 },[])


  useEffect(() => {
    const handleRouteChange = (url) => {

      
        if(isEmailFinished || routerConfirmPassedRef.current)  return;
        
      
     

          adminConfirm("Your progress will be lost. Leave anyway?").then((confirmed)=>{
            if(confirmed) {
              routerConfirmPassedRef.current = true;
              router.push(url);
            }
          })

        router.events.emit('routeChangeError');
        throw 'Route change aborted.';
        

       
        
        


      
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isEmailFinished]);

  
  


  return (
    <div className={styles.mainDiv}>
      <h1>New email</h1>

   

      {previewHtml.final?
      <EmailPreview previewHtml={previewHtml} setPreviewHtml={setPreviewHtml} />
      :
      <EasyEmailEditor/>
      
      }
      
    

    
    </div>
  )
}
