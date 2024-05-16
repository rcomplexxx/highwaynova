import React, { useCallback, useState } from 'react'
import styles from './sequencelist.module.css'
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import EmailList from './EmailList/EmailList';

export default function SequenceList({sequenceData, linkSequence}) {

   
//brisi sve kad se promeni sequenceType
  return (
    <div className = {styles.emailsListDiv}>
      {sequenceData?.map(sequence=>{
         return <SequenceElement id={sequence.id} title={sequence.title} emails={sequence.emails} linkSequence={linkSequence}/>

      })}
      </div>
  )
}


const SequenceElement= ({id, title, emails, linkSequence})=>{


  const [showEmails, setShowEmails] = useState(false);
  



  return <><div className={styles.sequenceDiv}>
            <div className={styles.sequenceInfoDiv}><span className={styles.id}>{id}</span><span>{title}</span></div>

           
            <button className={styles.addSequence} onClick={()=>{setShowEmails(!showEmails)}}>{showEmails?"Hide emails":"Show emails"}</button>
       
      <div className={styles.addSequenceWrapper}>
         <button className={styles.addSequence} onClick={()=>{linkSequence(id)}}>Link sequence</button>
         </div>
         </div>
           {showEmails && <EmailList emails={JSON.parse(emails)}/>}
         </>

  
}
