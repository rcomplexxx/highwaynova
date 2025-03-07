import React, { useState } from 'react'
import { Atom } from '@/public/images/svgs/svgImages';
import styles from './templatemanipulation.module.css'
import CustomOptionsCard from '@/components/Admin/Admin_Pages/Emails/NewEmail/EmailEditor/CustomOptionsCard/CustomOptionsCard'

export default function SaveTemplate({handleSaveTemplate}) {



  return (

<CustomOptionsCard mainButtonName='Save template' pushToRightStyle = {true} >

<button

className={styles.manipulateTemplateButton}

onClick={()=>{
        
        handleSaveTemplate('main')


      }}><Atom/> Save as main template</button>


<button

onClick={()=>{
        
        handleSaveTemplate("post_purchase")


      }}>Save as post_purchase template</button>
</CustomOptionsCard>
  )
}
