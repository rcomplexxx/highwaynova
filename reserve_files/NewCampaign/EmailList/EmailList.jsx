import React, { useCallback, useState } from 'react'
import styles from './emaillist.module.css'
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

export default function EmailList({emailData, addEmail, campaignType}) {

   
//brisi sve kad se promeni sequenceType
  return (
    <div className = {styles.emailsListDiv}>
      {emailData?.emails.map(email=>{
         return <EmailElement id={email.id} title={email.title} addEmail={addEmail} campaignType={campaignType}/>

      })}
      </div>
  )
}


const EmailElement= ({id, title, addEmail, campaignType})=>{

  const [emailSendDate, setEmailSendDate] = useState(null);
 

  console.log('email send date', emailSendDate)

  const handleAddEmail= ()=>{
    if(campaignType=='sequence' ){
      addEmail({id:id, title:title, campaignType:campaignType});
      return;
    }
    if (!emailSendDate)return;
    console.log('email send date inside', emailSendDate)

    addEmail({id:id, title:title, sendDate:emailSendDate,campaignType:campaignType});



  }



  return <div className={styles.emailDiv}>
            <div className={styles.emailInfoDiv}><span className={styles.id}>{id}</span><span>{title}</span></div>

           {campaignType =='campaign' && <DatePicker multiple={false}
            plugins={[
                <TimePicker format="HH:mm:ss" position="bottom" />
              ]}

              placeholder='Pick email sending date.'

            onChange={(date)=>{
             
              setEmailSendDate(date.unix*1000)}}
            minDate={Date.now()} 
            format="MM/DD/YYYY HH:mm:ss"  
            className={`bg-dark ${styles.datePicker}`}
    inputClass={styles.dateInput}
   />}
      <div className={styles.addEmailWrapper}>
         <button className={styles.addEmail} onClick={handleAddEmail}>Add email</button>
         </div>
         </div>

  
}
