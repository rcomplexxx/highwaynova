import { useMemo, useState } from 'react'
import styles from './campaigns.module.css'
import EmailCard from '../EmailCard/EmailCard'

export default function Campaigns({sequences, campaignData, emails}) {



console.log('hello!', campaignData);


  return (
  
     <div className={styles.mainDiv}>
      <h1>Campaigns</h1>
      {campaignData?.map(campaign=>{

        const currentSequenceEmails= sequences.find(seq =>{return seq.id == campaign.sequenceId})?.emails;

        return <CampaignCard id={campaign.id} title={campaign.title} 
        sequenceEmails={currentSequenceEmails?JSON.parse(currentSequenceEmails):undefined}
        sendingDateInUnix={campaign.sendingDateInUnix}
        emailSentCounter={campaign.emailSentCounter} targetCustomers={campaign.targetCustomers}
        targetType = {campaign.targetType}
        emails={emails}/>
       
      })
    

}
    </div>
  )
}


function CampaignCard({id, title, sequenceEmails, sendingDateInUnix, targetCustomers, targetType, emails}){


  const [showEmailInfo, setShowEmailInfo]= useState();


    
 

  return <div className={styles.campaignDiv}>
     

   
   

    <div className={styles.id}>
   
   {id}
 </div>


<div className={styles.infoArea}>

<div className={styles.infoField}>


<div> 
    <span className={styles.infoLabel}>Traffic type: </span>
    <span className={styles.infoSpan} >{targetType}</span>
 </div>

 <div>
    <span className={styles.infoLabel}>Send date: </span>
    <span className={styles.infoSpan} >{new Date(sendingDateInUnix * 1000).toLocaleDateString()}</span>
 </div>




 </div>



  <input value={title} className={styles.campaignInput} placeholder='Campaign title'/>

  </div>


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

  {showEmailInfo && <EmailCard id={showEmailInfo.id} title={showEmailInfo.title} text={showEmailInfo.text} emails={emails}/>}




</div>

}
