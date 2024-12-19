import  {  useState } from 'react'
import styles from './emaillist.module.css'
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import DelayPicker from './DelayPicker/DelayPicker';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';

export default function EmailList({emails, addEmail, isFirstEmail}) {

   
//brisi sve kad se promeni sequenceType
  return (
    <div className = {styles.emailsListDiv}>
      {emails?.map((email, index)=>{
         return <EmailElement key={email.id} id={email.id} title={email.title} addEmail={addEmail} isFirstEmail={isFirstEmail}/>

      })}
      </div>
  )
}


const EmailElement= ({id, title, addEmail, isFirstEmail})=>{

  const [sendTimeGap, setSendTimeGap] = useState();
 

  

  const handleAddEmail = () => {
    if (isFirstEmail) return addEmail({ id, title });
    if (!sendTimeGap) return adminAlert('error', 'Error', 'Time gap not added or confirmed.');
    addEmail({ id, title, sendTimeGap });
  };



  return <div className={styles.emailDiv}>
            <div className={styles.emailInfoDiv}><span>{id}</span><span>{title}</span> </div>

           {!isFirstEmail && <DelayPicker sendTimeGap={sendTimeGap} setSendTimeGap={setSendTimeGap}/>}
           
     
     
         <button onClick={handleAddEmail}>Add email</button>
      
      
         </div>

  
}
