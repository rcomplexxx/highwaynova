import { useRef, useState } from 'react'
import GetDataButton from '../MagicButtons/GetDataButton'
import Link from 'next/link';
import EmailCard from './EmailCard/EmailCard';
import styles from './emails.module.css'

export default function Emails({emailData, setEmailData}) {

  const [updatedEmailData, setUpdatedEmailData] = useState([]);
 

  console.log('my email data', emailData);

    const getEmailData=async()=>{

        try {
            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
               { dataType:'get_emails' } 
              ),
            });
      
            if (response.ok) {
              const data = await response.json();
              console.log("Maine DATA!", data);
              //Ovde takodje zatraziti emails campaign kasnije .
              //na slican princip kao sto sam trazio emails.



             
              const emailsPresentedInSequences = [];

               data.data?.sequences.forEach(sequence=>{

                

               JSON.parse(sequence.emails).forEach(email=>{emailsPresentedInSequences.push(email.id)}) 


              
              });

              const emailsUnusedInSequences =  data.data?.emails.filter(email=>{return !emailsPresentedInSequences.find(emailSeq=> emailSeq===email.id)})

              setEmailData({...data.data, emailsUnusedInSequences:emailsUnusedInSequences});


          

              console.log('Email data', data);
             
             
            } else {
              throw new Error("Network response was not ok.");
            }
          } catch (error) {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          }

    }

    const handleUpdateEmailsInDb = async()=>{
     
      if(updatedEmailData.length==0)return;
     
        await fetch("/api/admincheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataType: 'send_email_data', data: updatedEmailData }),
        })
          .then((response) => {
            if (response.ok) {
              console.log(response);
              setEmailData({...emailData, emails:[]});
            }
          })
  
          .catch((error) => {console.log(error)});
    }

    

    const handleSaveEmail = (id, title,text)=>{
      let newEmailData;
      if(updatedEmailData.findIndex((emData)=>{return emData.id==id})!==-1)
      newEmailData=updatedEmailData.map((data)=>{
    if(data.id==id)return {id:id,title:title,text:text};
    return data;
  })
  else{
    newEmailData=[...emailData.emails];
    newEmailData.push({id:id,title:title,text:text})
  }

      setUpdatedEmailData(
        newEmailData

      );
    }

    console.log('em data' , emailData);

  return (
    <div className={styles.mainDiv}>
      <h1>Emails</h1>
      <div className={styles.interfaceDiv}>
      <button className={styles.magicButton} onClick={getEmailData}>Get email data</button>
      <button className={styles.magicButton} onClick={handleUpdateEmailsInDb}>Save email data</button>
      
      <Link className={styles.emailLink} href='/admin/emails/campaigns'>Campaigns</Link>
      <Link className={styles.emailLink} href='/admin/emails/sequences'>Sequences</Link>
      <Link className={styles.emailLink} href='/admin/emails/new-email'>New email.</Link>
      <Link className={styles.emailLink} href='/admin/emails/new-sequence'>New sequence.</Link>
      <Link className={styles.emailLink} href='/admin/emails/new-campaign'>New campaign.</Link>
      
      </div>
      {emailData?.emailsUnusedInSequences?.map((email, index)=>{
       
       return <EmailCard key={index} id={email.id} title={email.title} text={email.text} handleSaveEmail={handleSaveEmail}/>
      })}
   
    </div>
  )
}
