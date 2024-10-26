import React, { useRef, useEffect, useState } from 'react';

import EmailEditor from 'react-email-editor';

import styles from './emaileditor.module.css'
import ColorPicker from './ColorPicker/ColorPicker';
import LoadTemplate from './TemplateManipulation/LoadTemplate';
import SaveTemplate from './TemplateManipulation/SaveTemplate';
import EditorHtmlSnippets from './EditorHtmlSnippets/EditorHtmlSnippets';
import { transformColorToHex } from '@/utils/utils-client/transformColorToRgba';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';




const EasyEmailEditor = ({setPreviewHtml, setEditorDesign, editorDesign, emailFontValue, setEmailFontValue, emailWidthMode, setEmailWidthMode, mainBackgroundColor, setMainBackgroundColor}) => {

 
  const [websiteFontWarning, setWebsiteFontWarning] = useState('not_website_font');

  const [generalFontSize, setGeneralFontSize] = useState(16);


const emailEditorRef = useRef();

useEffect(()=>{


  const globalFont = getComputedStyle(document.documentElement).getPropertyValue('--font-neutral').trim()?.toLowerCase();



  const notWebsiteFontCheckButtonDisplay = ()=>{
    if(Array.from(document.getElementById('font_email_select'))
      .find(o=>{return o.value!=="" && globalFont.includes(o.value.toLowerCase())})){

        setWebsiteFontWarning('not_website_font_show_button')
    } 
    else{
      

    
      
      setWebsiteFontWarning('not_website_font')

    }
  }


  if(emailFontValue===""){
    
    notWebsiteFontCheckButtonDisplay();
    return;
  }


 
      
  
    

    if(globalFont.includes(emailFontValue.toLowerCase()))
      setWebsiteFontWarning('is_website_font')
    else notWebsiteFontCheckButtonDisplay();

    

 
    

},[emailFontValue])



const handleSaveTemplate = async(templateType) => {



  await emailEditorRef.current?.editor?.exportHtml(async(data) => {


    

    if (!await adminConfirm('Current main template will be overriden. Proceed?')) return;

 
    


    const { design } = data;
if (!design) return;

try {
  const response = await fetch("/api/admincheck", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataType: 'update_new_email_template',
      data: {
        designJson: JSON.stringify(design),
        emailFontValue,
        emailFontSize: generalFontSize,
        emailWidthModeValue: emailWidthMode,
        mainBackgroundColor,
        templateType,
      },
    }),
  });

  if (response.ok) console.log(response);
} catch (error) {
  console.log(error);
}

})

};



const handleLoadTemplate = async(displayWarning, templateType) => {


  if(displayWarning && !await adminConfirm('Current progress will be lost. Proceed?'))return;

 



try{

 const response = await fetch("/api/admincheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType: 'get_email_templates'}),
  })

  if(response.ok){
    console.log(response);
    const data = await response.json();

   

    const templateData= templateType==='main'?(data?.data[0]):(data?.data[1]);

    console.log('data', templateData)
    

    const editorDesign = templateData.designJson && JSON.parse(templateData.designJson);

    emailEditorRef.current?.editor.loadDesign(editorDesign);

    setGeneralFontSize(templateData.emailFontSize)
    setEmailFontValue(templateData.emailFontValue);
    setEmailWidthMode(templateData.emailWidthModeValue);
    setMainBackgroundColor(templateData.mainBackgroundColor)
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

            if(generalFontSize){
          
optimizedHtml = optimizedHtml.replace(/(body\s*{)([^}]*)(})/, (match, p1, p2, p3) => {
    const addedContent = `${p1}${p2}  font-size: ${generalFontSize};\n ${p3}`;
    return addedContent;
});

            }
            

            setPreviewHtml({final: true, html:optimizedHtml});

          });
        };
      
     

        const changeEmailFontValue = (event)=>{

          const newEmailFontValue = event.target.value;
          
          setEmailFontValue(newEmailFontValue);
      
       
      
          
          
          }



   return <>

 <div className={styles.editorBar}>

 

  {websiteFontWarning==='is_website_font' && <span className={styles.fontmatchesSpan}>Email font matches website font</span>}

{websiteFontWarning.includes('not_website_font') &&  <span className={styles.fontWarningSpan}>Warning! Email font does not match site main font.</span>}


 {websiteFontWarning === 'not_website_font_show_button' && 
 <button onClick={()=>{


  const globalFont = getComputedStyle(document.documentElement).getPropertyValue('--font-neutral').trim()?.toLowerCase();

  const matchingFont = Array.from(document.getElementById('font_email_select'))
    .find(o=>{return o.value!=="" && globalFont.includes(o.value.toLowerCase())})

   

     setEmailFontValue(matchingFont.value);
  

 }}>Use website font</button>}



< ColorPicker mainBackgroundColor={mainBackgroundColor} setMainBackgroundColor={setMainBackgroundColor}/>

<EditorHtmlSnippets/>

  </div>





  


   
   <div className={styles.editorBar}>

   <select id='font_email_select' value={emailFontValue} onChange={changeEmailFontValue} className={styles.emailFontValueSelect}>
        
        
        <option value="">Use editor's default font</option>
        <option value="Inter">Use Inter</option>
        <option value="Arial">Use Ariel</option>
        <option value="Helvetica">Use Helvatica</option>
        <option value="Verdana">Use Verdana</option>
        <option value="Calibri">Use Calibri</option>
        <option value="Palatino">Use Palatino</option>
        <option value="'Trebuchet MS'">Use Trebuchet</option>
        <option value="Geneva">Use Geneva</option>
       
        
        <option value="Tahoma">Use Tahoma</option>
        <option value="Roboto">Use Roboto</option>
        <option value="Montserrat">Use Montserrat</option>
        <option value="'Open Sans'">Use Open Sans</option>
        <option value="'Source Sans Pro'">Use Source Sans Pro</option>


        <option value="'Times New Roman', serif">Use Times New Roman</option>
        <option value="Georgia, serif">Use Georgia</option>

    </select>

    <div className={styles.fontSizeDiv}>
<input className={styles.fontSizeInput} type='number' min={8} max={72}

value={generalFontSize}
onChange={(event)=>{
  const value = event.target.value;

  if(value<1 || value >72) return;

  setGeneralFontSize(value);

}}
/>
<span className={styles.fontSizeLabel}>General font size</span>
<span className={styles.fontSizePxLabel}>px</span>
</div>

    <select
    value={emailWidthMode}
    onChange={(event)=>{setEmailWidthMode(event.target.value)}}
    className={styles.emailFontValueSelect}>
    <option value={'clear_all_width'}>Clear any width/max-width</option>
    <option value={'clear_max_width'}>Clear max-width - recommended</option>
        <option value="">Clear no width</option>
       


        </select>
    
    <SaveTemplate handleSaveTemplate={handleSaveTemplate}/>
    <LoadTemplate handleLoadTemplate={handleLoadTemplate}/>
   </div>
   <EmailEditor style={{ maxWidth:"none", minHeight: '980px', border: '1px solid #ccc' }} ref={emailEditorRef} 

  onReady={()=>{




    emailEditorRef.current.editor.registerCallback('image', async(file, done) => {
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

    


    









    if(editorDesign){
        emailEditorRef.current?.editor.loadDesign(editorDesign)
        
    }

    else{
      handleLoadTemplate(false, 'main');
    }
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