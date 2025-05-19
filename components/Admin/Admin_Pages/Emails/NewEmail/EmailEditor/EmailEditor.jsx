import React, { useRef, useEffect, useState } from 'react';

import EmailEditor from 'react-email-editor';

import styles from './emaileditor.module.css'

import { transformColorToHex } from '@/utils/utils-client/transformColorToRgba';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import InstructionsWrapper from '../../../Admin_Home/InstructionsWrapper/InstructionsWrapper';
import EmailHeader from './EmailHeader/EmailHeader';
import { useNewEmailStore } from '../NewEmailZustand';




const EasyEmailEditor = () => {


    const { mainEmailFontSize, setPreviewHtml, editorDesign, setEditorDesign, emailFontValue,
       emailWidthMode,  mainBackgroundColor, emailEditor, setEmailEditor, handleLoadTemplate } = useNewEmailStore();
    

       




    const handleUploadHTML = () => {
        
        
        emailEditor?.exportHtml((data) => {
            const { design, html } = data;

            if(!html) return;
            
            
            setEditorDesign(design);

          console.log('should change font to', emailFontValue)

            let optimizedHtml = html.replace(/<!--[\s\S]*?-->/g, '')
            

            let emailMainWidth =  optimizedHtml.match(/\.u-row\s*\{\s*width:\s*(\d+)px\s*!important;/)[1];
            
      
              optimizedHtml = optimizedHtml .replace('body {',`.u-row-container{\nbackground-color: ${mainBackgroundColor} !important;\n}\n\n
                table{\nmax-width: ${emailMainWidth}px !important;\n}\n\n
                body {`);

                

            const computedStyles = window.getComputedStyle(document.documentElement);
    
            // Extract the font-family property
            // const order_color = computedStyles.getPropertyValue('--email-order-summery-color');
            const total_color = transformColorToHex(computedStyles.getPropertyValue('--email-post-purchase-total-color'));
            const sticker_price_color = transformColorToHex(computedStyles.getPropertyValue('--email-post-purchase-sticker-price-color'));
            const order_weak = transformColorToHex(computedStyles.getPropertyValue('--email-post-purchase-variant-color'));

           
            

            optimizedHtml = optimizedHtml.replace(/{{order_details}}/g, `{{order_details[${order_weak},${sticker_price_color},${total_color}]}}`)

            // optimizedHtml = optimizedHtml.replace(/(\.u-row .u-col\s*\{[^}]*?)(\})/gi, (match, p1, p2) => {
            //   return `${p1}  background-color: ${mainBackgroundColor};\n  ${p2}`;
            // });

          


          

         

            if(emailWidthMode === 'clear_all_width'){
              console.log('will edit widths', emailWidthMode)
              optimizedHtml = optimizedHtml.replace(/(?<!min-)width[^'"\`;]*?px.*?;|max-width[^'"\`;]*?px.*?;/gi, '');
            }

            else if(emailWidthMode === 'clear_max_width'){

              console.log('will edit widths', emailWidthMode)
              optimizedHtml = optimizedHtml.replace(/max-width[^'"\`;]*?px.*?;/gi, '');

            }


            if(emailFontValue){
              
              
              optimizedHtml= optimizedHtml .replace(/font-family:arial,helvetica,sans-serif;/gi, `font-family: ${emailFontValue}, arial,helvetica,sans-serif;`);

            }

            if(mainEmailFontSize){
          
optimizedHtml = optimizedHtml.replace(/(body\s*{)([^}]*)(})/, (match, p1, p2, p3) => {
    const addedContent = `${p1}${p2}  font-size: ${mainEmailFontSize};\n ${p3}`;
    return addedContent;
});

            }
            

            setPreviewHtml({final: true, html:optimizedHtml});

          });
        };
      
     

      



   return <>

<InstructionsWrapper wrapperCssClassModifier={styles.instructionsWrapperModifier}>

<span className={styles.instructionSpan}>1. Set options in custom header above Email maker to complement your brand design(main email bg, font, general font size, etc.).</span>
<span className={styles.instructionSpan}>2. Main template will be loaded in Email maker. You can change template on Load template button.</span>

<span className={styles.instructionSpan}>3. Create email with Email maker.</span>
<span className={styles.instructionSpan}>4. For more(custom made) html elements, you can click on 'Editor html snippets', and by clicking, copy any of provided snippets. You can use coppied snippet on Email maker element 'html'.</span>
<span className={styles.instructionSpan}>5. You can save as main(or any other) template on Save template button.</span>
<span className={styles.instructionSpan}>6. Click continue to Email preview(below Email maker) when done.</span>




</InstructionsWrapper>




 <EmailHeader/>
   <EmailEditor style={{ maxWidth:"none", minHeight: '980px', border: '1px solid #ccc' }}  

  onReady={(editor)=>{

    setEmailEditor(editor);


    editor.registerCallback('image', async(file, done) => {
      // Handle file upload here

      console.log('uploading picture!', file)

   



        try {

     
          const formData = new FormData();
          formData.append('file', file.attachments[0])

       

          const response = await fetch('/api/adminupload', {
            method: 'POST',
            body: formData
          });
      
          // Make sure the response was valid
          if (response.status === 200) {
            const data = await response.json();
            // Pass the URL back to Unlayer to mark this upload as completed

            console.log('data received', data)
            done({ progress: 100, url: data.fileUrl });
          } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
          }
     



   
      



    } catch (error) {
      console.error('Upload failed:', error);
      // Handle the error appropriately
    }

    })

    


    









    if(editorDesign) {
      console.log('hello', editor);
      editor.loadDesign(editorDesign)
    }
    else handleLoadTemplate(false, 'main');
    
  
  
  
  }}




  

    options={
      {
        appearance:{
          theme:"modern_dark"
        },
        safeHtml: true,

        displayMode:"email",

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
            video: {
              enabled: true
            },
            timer: {
              enabled: true
            }
            // Add more tools as needed
          },

          features: {userUploads: true,
            undoRedo: true,
            textEditor: {
              spellChecker: true,
              tables: true
            }
          },
          editor:{confirmOnDelete: false},

          mergeTags:{
            customer_id: {
              name: "1 | {{customer_id}}",
              value: "{{customer_id}}",
              sample: "{{customer_id}}"
            },
            customer_hash: {
              name: "2 | {{customer_hash}}",
              value: "{{customer_hash}}",
              sample: "{{customer_hash}}"
            },
            order_id: {
              name: "3 | {{order_id}}",
              value: "{{order_id}}",
              sample: "{{order_id}}"
            },

         

            order_details: {
              name: "4 | {{order_details}}",
              value: "{{order_details}}",
              sample: "{{order_details}}"
            },
           
         
          }

      }
    }
     
     
     
     />

     <button className={styles.continueToPreviewButton} onClick={handleUploadHTML}>Continue to email preview</button>

</>

}

export default EasyEmailEditor;