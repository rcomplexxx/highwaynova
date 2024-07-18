import React, { useState } from 'react'
import styles from './customoptionscard.module.css'
import { CancelIcon } from '@/public/images/svgs/svgImages';

export default function CustomOptionsCard({children, mainButtonName, pushToRightStyle}) {

    const [activateOptions, setActivateOptions] = useState(false);

  


  return (
    <>
      <button className={pushToRightStyle && styles.pushToRightStyle} onClick={()=>{setActivateOptions(true)}}>{mainButtonName}</button>

     { activateOptions && <div onClick={()=>{ setActivateOptions(false)}} className={styles.templateManipulationWrapper}>

        <div className={styles.templateManipulationWrapper2}>

   
    {children}

      
<CancelIcon handleClick={()=>{ setActivateOptions(false)}} color={`red`} styleClassName={styles.cancelTemplateManipulation}/>
      </div>



      </div>
      
      }
    </>
  )
}
