import { useState } from 'react'
import Link from 'next/link';
import EmailCard from './EmailCard/EmailCard';
import styles from './emails.module.css'

export default function Emails({emailData, setEmailData}) {

  const [updatedEmailData, setUpdatedEmailData] = useState([]);
 

  

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
      
            if (!response.ok) throw new Error("Network response was not ok.");

              const {data} = await response.json();
              console.log("Maine DATA!", data);
              //Ovde takodje zatraziti emails campaign kasnije .
              //na slican princip kao sto sam trazio emails.

             
              const emailsPresentedInSequences = data?.sequences.reduce((acc, sequence) => {
                return acc.concat(JSON.parse(sequence.emails).map(email => email.id));
              }, []) || [];

              const emailsUnusedInSequences = data?.emails.filter(email => 
                !emailsPresentedInSequences.includes(email.id)
              );

              setEmailData({...data, emailsUnusedInSequences:emailsUnusedInSequences});

              
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
          }

    }

    const handleUpdateEmailsInDb = async () => {
  if (!updatedEmailData.length) return;

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'update_email_data', data: updatedEmailData }),
    });
    if (response.ok) setEmailData({ ...emailData, emails: [] });
  } catch (error) {
    console.log(error);
  }
};

    

const handleSaveEmail = (id, title, text) => {
  const newEmailData = updatedEmailData.some((emData) => emData.id === id)
      ? updatedEmailData.map((data) => (data.id === id ? { id, title, text } : data))
      : [...emailData.emails, { id, title, text }]
 

  setUpdatedEmailData(newEmailData);
};





  return (
    <div className={styles.mainDiv}>
      <h1>Emails</h1>
      <div className={styles.interfaceDiv}>
      <button onClick={getEmailData}>Get email data</button>
      <button className={styles.marginBottomClass} onClick={handleUpdateEmailsInDb}>Save email data</button>
      
      <Link href='/admin/emails/campaigns'>Campaigns</Link>
      <Link href='/admin/emails/sequences'>Sequences</Link>
      <Link href='/admin/emails/new-email'>New email.</Link>
      <Link href='/admin/emails/new-sequence'>New sequence.</Link>
      <Link href='/admin/emails/new-campaign'>New campaign.</Link>
      
      </div>
      {emailData?.emailsUnusedInSequences?.map((email, index)=>{
       
       return <EmailCard key={index} id={email.id} title={email.title} text={email.text} handleSaveEmail={handleSaveEmail}/>
      })}
   
    </div>
  )
}
