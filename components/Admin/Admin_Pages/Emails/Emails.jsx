import { useState } from 'react'
import Link from 'next/link';
import EmailCard from './EmailCard/EmailCard';
import styles from './emails.module.css'
import { useAdminStore } from '../../AdminZustand';
import { Spinner2 } from '@/public/images/svgs/svgImages';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';

export default function Emails() {

  
 

  
const {emailData, setEmailData, emailDataUpdate, setEmailDataUpdate} = useAdminStore();
 
  

//     const handleUpdateEmailsInDb = async () => {
//   if (!updatedEmailData.length) return adminAlert('error', `Can't update email data`, 'No changes have been made.');

//   try {
//     const response = await fetch("/api/admincheck", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ dataType: 'update_email_data', data: updatedEmailData }),
//     });

//     if (!response.ok) throw new Error("Network response was not ok.");
//     setEmailData((emailData)=>{ return {...emailData, emails: [] }});

//     setUpdatedEmailData([])
//     setEmailDataUpdate(true);

//     return adminAlert('success', 'Email data updated.', 'Email data has been sucessfully updated')
//   } catch (error) {
//     console.log(error);
//    return adminAlert('error', `Can't update email data`, 'Server error occured.');
//   }
// };

    



// const handleUpdateEmail = (id, title, text) => {
//   const newEmailData = updatedEmailData.map((data) =>
//     data.id === id ? { id, title, text } : data
//   );
  
//   if (!updatedEmailData.some((emData) => emData.id === id)) {
//     newEmailData.push({ id, title, text });
//   }
 

//   setUpdatedEmailData(newEmailData);
// };


const handleUpdateEmail = async (id, title, text) =>{

  

  if(!await adminConfirm('Changes are irreversible. Are you sure you want to continue?')) return;

  const updatedEmail = [{id, title, text}]

  
  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'update_email_data', data: updatedEmail }),
    });

    if (!response.ok) throw new Error("Network response was not ok.");

    
 
    
    
    setEmailDataUpdate(true);

    return adminAlert('success', 'Email data updated.', 'Email data has been sucessfully updated')
  } catch (error) {
    console.log(error);
   return adminAlert('error', `Can't update email data`, 'Server error occured.');
  }
}




if(emailDataUpdate.shouldUpdate)return  <div className={styles.mainDiv}>
      <h1>Emails</h1>
      <Spinner2/>
      </div>



  return (
    <div className={styles.mainDiv}>
      <h1>Emails</h1>
      <div className={styles.interfaceDiv}>
    
        

       {emailData.emails.length===0 && <button className={styles.marginBottomClass} onClick={()=>{setEmailDataUpdate(true)}}>Get email data</button>}
      
      <Link href='/admin/emails/campaigns'>Campaigns</Link>
      <Link href='/admin/emails/sequences'>Sequences</Link>
      <Link href='/admin/emails/new-email'>New email.</Link>
      <Link href='/admin/emails/new-sequence'>New sequence.</Link>
      <Link href='/admin/emails/new-campaign'>New campaign.</Link>
      
      </div>
      {emailData?.unsequencedEmails?.map((email, index)=>{
       
       return <EmailCard key={index} id={email.id} title={email.title} text={email.text} handleUpdateEmail={handleUpdateEmail} setEmailDataUpdate={setEmailDataUpdate}/>
      })}
   
    </div>
  )
}
