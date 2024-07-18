import { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import styles from './colorpicker.module.css'


export default function ColorPicker({mainBackgroundColor, setMainBackgroundColor}) {

    const [showColorPicker, setShowColorPicker]= useState(false);

    const [mainBgBrightness, setMainBgBrightness] = useState(0);



  
  
    useEffect(() => {


      const handleClickOutside = (e) => {

       

        if (!document.getElementById('colorPickerWrapper').contains(e.target)) {
          setShowColorPicker(false);


          //mogu ovde da namontiram funkciju da loadujem i reloadujem html
        }
      };


      if (showColorPicker) {
        document.addEventListener('click', handleClickOutside);
      } 
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [showColorPicker]);


  return (
    <>
        
        <div id = 'colorPickerWrapper' className={styles.colorPickerWrapper}>
            {showColorPicker &&  <div className={styles.colorPickerDiv}> < SketchPicker color={mainBackgroundColor} onChange={(color,event)=>{setMainBackgroundColor(color.hex); setMainBgBrightness(color.rgb.b)}} /></div>}
            <span className={styles.pickedColorSpan} style={{backgroundColor:mainBackgroundColor, color:mainBgBrightness<50?"var(--neutral-9)":"var(--neutral-0)"}}  onClick={()=>{ setShowColorPicker(!showColorPicker)}}>Main email bg color{mainBackgroundColor}</span>
        </div>
        
      
        
        </>
  )
}
