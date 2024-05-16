import React, { useState } from 'react'
import styles from './sequences.module.css'
import EmailCard from '../EmailCard/EmailCard'

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


    return <div className={styles.campaignDiv}>
     

<div className={styles.idDiv}> 


<div className={styles.currentId}>

<span className={styles.currentIdSpan}>sequence id: </span>
{id}
</div>






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
{showEmailInfo && <EmailCard id={showEmailInfo.id} title={showEmailInfo.title} text={showEmailInfo.text} emails={emails}/>}
</div>

}



