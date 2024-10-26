import { useState } from 'react'
import styles from './sequences.module.css'
import EmailCard from '../EmailCard/EmailCard'
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm'

export default function Sequences({emails,sequences}) {



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

    if(hideSequence) return null;


    return <div className={styles.campaignDiv}>
     

<div className={styles.idDiv}> 


<div className={styles.currentId}>

<span className={styles.currentIdSpan}>sequence id: </span>
{id}
</div>



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

       
       
   
        
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }


  
}} className={styles.deleteSequenceButton}>Delete sequence</buttons>


</div>


<input value={title} className={styles.campaignInput} placeholder='Campaign title'/>
{/* {campaign.emails.map(email=>{return })} */}
Emails
<div className={`${styles.campaignEmailsDiv}`} placeholder='Included emails'>

{sequenceEmails?.map(email =>{return <div className={styles.campaignEmailDiv}>
<span>id {email.id}</span>
{email.sendTimeGap && <span>Send time gap {email.sendTimeGap}</span>}
<button onClick={()=>{ setShowEmailInfo(emails?.find(email2 =>{return email.id==email2.id}))}} className={styles.showEmailButton}>Show email</button>
</div>
})}



</div>




{showEmailInfo && <EmailCard id={showEmailInfo.id} title={showEmailInfo.title} text={showEmailInfo.text} 


handleSaveEmail = {async (id, emailTitle, emailTextHtml) => {
  const emailData = [{ id, title: emailTitle, text: emailTextHtml }];

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: "update_email_data", data: emailData }),
    });

    if (response.ok) {
      console.log(response);
      setShowEmailInfo(false);
    }
  } catch (error) {
    console.log(error);
  }
}}

/>}
</div>

}


