import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './newsequence.module.css'
import {useRouter} from 'next/router'


import EmailList from './EmailList/EmailList';

export default function NewSequence({emailData, setEmailData}) {

  const [sequenceEmails, setSequenceEmails] = useState([]);
  
  const titleRef = useRef();

  const router = useRouter();



  console.log('camp emails', sequenceEmails);




  let sequenceEmailsInputString = useMemo(()=>{
    
    let inputString=``;
    sequenceEmails.forEach(email=>{inputString=inputString+ 
        `{Id: ${email.id}, title: ${email.title}${email.sendTimeGap?`, sendTimeGap: ${email.sendTimeGap}`:''}}`});
    return inputString;
  },[sequenceEmails])
  

    useEffect(()=>{
        if(emailData.emails.length==0){

            (async function() {
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
                  setEmailData(data.data);
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

            })();

        }
    },[])

    const addEmail=(newEmail)=>{
      console.log('add', sequenceEmails.findIndex((email)=>{return email.id==newEmail.id}))
      if(
        sequenceEmails.findIndex((email)=>{return email.id==newEmail.id})!==-1
      )return;
      setSequenceEmails([...sequenceEmails, newEmail])
    }

    const handleSaveSequence = async()=>{
      if(titleRef.current.value=='' || sequenceEmails.length==0)return;
      
   
      let newSequenceData = {title:titleRef.current.value, emails:JSON.stringify(sequenceEmails.map((email)=>{
      

       return {id:email.id, sendTimeGap:email.sendTimeGap}
      }))
      
      };

  
     
      await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataType: 'send_new_sequence', data: newSequenceData  }),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            router.push('/admin/emails');
          }
        })

        .catch((error) => {console.log(error)});
    }




const filteredEmails = emailData?.emailsUnusedInSequences?.filter(email=>{
  
  
  return sequenceEmails.findIndex((seqEmail)=>{return seqEmail.id===email.id})==-1})



  return (
    <div className={styles.mainDiv}>
      <h1>New email sequence</h1>
    
    

      <input ref={titleRef} className={styles.sequenceInput} placeholder='Sequence title'/>
      <input value={sequenceEmailsInputString} className={styles.sequenceInput} placeholder='Included emails'/>
      <EmailList emails={filteredEmails} addEmail={addEmail} isFirstEmail={sequenceEmails.length===0}/>
      <button className={styles.saveSequence} onClick={handleSaveSequence}>Save sequence</button>
      </div>

  )
}
