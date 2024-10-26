import  { useEffect, useMemo, useRef, useState } from 'react'
import styles from './newsequence.module.css'
import {useRouter} from 'next/router'


import EmailList from './EmailList/EmailList';

export default function NewSequence({emailData, setEmailData}) {

  const [sequenceEmails, setSequenceEmails] = useState([]);
  const [isEssencialFlow, setIsEssencialFlow] = useState();
  
  const titleRef = useRef();

  const router = useRouter();



  console.log('camp emails', sequenceEmails);


    //Slect if the sequence is essencial(only should be shown if sequence is flow), like thank you or welcome flow
    const essencialFlowSelector = () => {
      const availableKeySequences = Object.keys(emailData.keySequences).filter(
        (key) => !emailData.keySequences[key] && key !== "id"
      );
    
      if (!availableKeySequences.length) return null;
    
      return (
        <select
          id="essencialFlowSelect"
          className={styles.essencialFlowSelect}
          value={isEssencialFlow}
          onChange={(e) => setIsEssencialFlow(e.target.value)}
        >
          <option value={undefined}>Select key sequence type</option>
          <option value={undefined}>Sequence is not key sequence</option>
          {availableKeySequences.map((keySequence) => (
            <option key={keySequence} value={keySequence}>
              {keySequence}
            </option>
          ))}
        </select>
      );
    };




    const sequenceEmailsInputString = useMemo(() =>
      sequenceEmails
        .map(email => `{Id: ${email.id}, title: ${email.title}${email.sendTimeGap ? `, sendTimeGap: ${email.sendTimeGap}` : ''}}`)
        .join('')
    , [sequenceEmails]);
  

    useEffect(()=>{
        if(emailData.emails.length!==0) return;

          (async function() {
            try {
              const response = await fetch("/api/admincheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataType: 'get_emails' })
              });
          
              if (!response.ok) throw new Error("Network response was not ok.");
          
              const { data } = await response.json();
              console.log("Maine DATA!", data);
              setEmailData(data);
            } catch (error) {
              console.error("Fetch operation error:", error);
            }
          })();

        
    },[])



   const addEmail = (newEmail) => {
      if (sequenceEmails.some((email) => email.id === newEmail.id)) return;
      setSequenceEmails([...sequenceEmails, newEmail]);
    };



    const handleSaveSequence = async () => {
  if (!titleRef.current.value || !sequenceEmails.length) return;

  const newSequenceData = {
    title: titleRef.current.value,
    emails: JSON.stringify(sequenceEmails.map(({ id, sendTimeGap }) => ({ id, sendTimeGap }))),
    key_sequence_type: isEssencialFlow,
  };

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'insert_new_sequence', data: newSequenceData }),
    });

    if (response.ok) router.push('/admin/emails');
  } catch (error) {
    console.error(error);
  }
};




const filteredEmails = emailData?.emailsUnusedInSequences?.filter(
  (email) => !sequenceEmails.some((seqEmail) => seqEmail.id === email.id)
);



  return (
    <div className={styles.mainDiv}>
      <h1>New email sequence</h1>

      <span className={styles.instructionSpan}>You can use [orderId] in thank you sequence, and it will be replaced with actualy orderId</span>





      <input ref={titleRef} className={styles.sequenceInput} placeholder='Sequence title'/>
      <input value={sequenceEmailsInputString} className={styles.sequenceInput} placeholder='Included emails'/>
      <EmailList emails={filteredEmails} addEmail={addEmail} isFirstEmail={sequenceEmails.length===0}/>
      <button className={styles.saveSequence} onClick={handleSaveSequence}>Save sequence</button>
      </div>

  )
}
