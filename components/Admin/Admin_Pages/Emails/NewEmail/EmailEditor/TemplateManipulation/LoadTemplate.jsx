import React, { useState } from 'react'

import { Atom } from '@/public/images/svgs/svgImages';
import styles from './templatemanipulation.module.css'
import CustomOptionsCard from '../CustomOptionsCard/CustomOptionsCard';

export default function LoadTemplate({handleLoadTemplate}) {



  return (
 <CustomOptionsCard mainButtonName='Load template' >

<button 

className={styles.manipulateTemplateButton}
onClick={()=>{
        
      
        handleLoadTemplate(true, 'main')


      }}><Atom/> Load main template</button>

<button onClick={()=>{
        
   
        handleLoadTemplate(true, 'post_purchase')


      }}>Load post_purchase template</button>

 </CustomOptionsCard>
  )
}
