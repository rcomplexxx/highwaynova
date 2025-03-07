import { useState } from 'react'
import styles from './sequences.module.css'
import EmailCard from '../EmailCard/EmailCard'
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm'
import { useAdminStore } from '@/components/Admin/AdminZustand';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';

export default function Sequences() {


    const emailData = useAdminStore((state) => state.emailData);
    const { emails, sequences } = emailData || {};



    return (
  
        <div className={styles.mainDiv}>
         <h1>Sequences</h1>

        
         {sequences?.map(sequence=>{
   
      
           return <SequenceCard id={sequence.id} title={sequence.title} 
           sequenceEmails={JSON.parse(sequence.emails)}
           emails={emails}/>
          
         })
       
   
   }
       </div>
     )


   
}


const SequenceCard = ({id, title, sequenceEmails, emails})=>{

    const [showEmailInfo, setShowEmailInfo] = useState(false);
    const [hideSequence, setHideSequence] = useState(false);

    const setEmailDataUpdate = useAdminStore((state) => state.setEmailDataUpdate);
   
    

    if(hideSequence) return null;


    return <div className={styles.campaignDiv}>
     

<div className={styles.campaignHeader}> 


<span className={styles.id}>{id}</span>



<buttons onClick={async ()=>{


  if (!await adminConfirm("Are you sure you want to delete this email?"))  return;


    try {
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
         { dataType:'delete_email_sequence', data:{deleteId: id }} 
        ),
      });

      if (!response.ok) throw new Error("Network response was not ok.");
      
        const data = await response.json();
        console.log("Maine DATA!", data);
       
        setHideSequence(true)
        setEmailDataUpdate(true)
       
       
   
        
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }


  
}} className={styles.deleteSequenceButton}>Delete sequence</buttons>


</div>


<input value={title} placeholder='Campaign title'/>


<div className={styles.infoArea}>
Emails
<div className={`${styles.campaignEmailsDiv}`} placeholder='Included emails'>

{sequenceEmails?.map(email =>{return <div className={styles.campaignEmailDiv}>
<span>id {email.id}</span>
{email.sendTimeGap && <span>Send time gap {email.sendTimeGap}</span>}
<button onClick={()=>{ setShowEmailInfo(emails?.find(email2 =>{return email.id==email2.id}))}} className={styles.showEmailButton}>Show email</button>
</div>
})}

</div>

</div>




{showEmailInfo && <EmailCard id={showEmailInfo.id} title={showEmailInfo.title} text={showEmailInfo.text} 


handleUpdateEmail = {async (id, title, text) => {



  
  if(!await adminConfirm('Changes are irreversible. Are you sure you want to continue?')) return;

  const emailData = [{ id, title, text}];

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: "update_email_data", data: emailData }),
    });

    if (!response.ok) throw new Error("Network response was not ok.");

      setShowEmailInfo(false);
      return adminAlert('success', 'Email data updated.', 'Email data has been sucessfully updated')
    
  } catch (error) {
    console.log(error);
    return adminAlert('error', `Can't update email data`, 'Server error occured.');
  }
}}

/>}



</div>

}


