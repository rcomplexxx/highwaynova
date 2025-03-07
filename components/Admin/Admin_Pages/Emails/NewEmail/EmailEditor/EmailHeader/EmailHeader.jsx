import React, { useEffect, useState } from 'react'


import ColorPicker from './ColorPicker/ColorPicker';
import LoadTemplate from './TemplateManipulation/LoadTemplate';
import SaveTemplate from './TemplateManipulation/SaveTemplate';
import EditorHtmlSnippets from './EditorHtmlSnippets/EditorHtmlSnippets';


import styles from './emailheader.module.css'
import { useNewEmailStore } from '../../NewEmailZustand';

export default function EmailHeader({handleLoadTemplate}) {

   const { generalFontSize, setGeneralFontSize, emailFontValue, setEmailFontValue,
       emailWidthMode, setEmailWidthMode, mainBackgroundColor, setMainBackgroundColor } = useNewEmailStore();

  const [websiteFontWarning, setWebsiteFontWarning] = useState('not_website_font');


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


  const changeEmailFontValue = (event)=>{

    const newEmailFontValue = event.target.value;
    
    setEmailFontValue(newEmailFontValue);

 

    
    
    }




  return (

     <>

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

     </>
  
  )
}
