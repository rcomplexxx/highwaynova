import  { useMemo, useRef, useState } from 'react'
import styles from './newsequence.module.css'



import EmailList from './EmailList/EmailList';
import { useAdminStore } from '@/components/Admin/AdminZustand';


export default function NewSequence() {


  
  const {emailData, setEmailDataUpdate} = useAdminStore();

  const [sequenceEmails, setSequenceEmails] = useState([]);
  const [isEssencialFlow, setIsEssencialFlow] = useState();
  
  const titleRef = useRef();

  



  console.log('camp emails', sequenceEmails);


    //Slect if the sequence is essencial(only should be shown if sequence is flow), like thank you or welcome flow
    // const essencialFlowSelector = () => {
    //   const availableKeySequences = Object.keys(emailData.keySequences).filter(
    //     (key) => !emailData.keySequences[key] && key !== "id"
    //   );
    
    //   if (!availableKeySequences.length) return null;
    
    //   return (
    //     <select
    //       id="essencialFlowSelect"
    //       className={styles.essencialFlowSelect}
    //       value={isEssencialFlow}
    //       onChange={(e) => setIsEssencialFlow(e.target.value)}
    //     >
    //       <option value={undefined}>Select key sequence type</option>
    //       <option value={undefined}>Sequence is not key sequence</option>
    //       {availableKeySequences.map((keySequence) => (
    //         <option key={keySequence} value={keySequence}>
    //           {keySequence}
    //         </option>
    //       ))}
    //     </select>
    //   );
    // };




    const sequenceEmailsInputString = useMemo(() =>
      sequenceEmails
        .map(email => `{Id: ${email.id}, title: ${email.title}${email.sendTimeGap ? `, sendTimeGap: ${email.sendTimeGap}` : ''}}`)
        .join('')
    , [sequenceEmails]);
  

  
    





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

    

    if (response.ok) {

      setEmailDataUpdate(true);
      

    }
  } catch (error) {
    console.error(error);
  }
};




const filteredEmails = emailData?.unsequencedEmails?.filter(
  (email) => !sequenceEmails.some((seqEmail) => seqEmail.id === email.id)
);



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
