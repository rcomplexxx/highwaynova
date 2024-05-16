import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './newcampaign.module.css'
import {useRouter} from 'next/router'


import EmailList from './EmailList/EmailList';

export default function NewCampaign({emailData, setEmailData}) {

  const [campaignEmails, setCampaignEmails] = useState([]);
  const [campaignType, setCampaignType] = useState('campaign');
  const titleRef = useRef();

  const router = useRouter();



  console.log('camp emails', campaignEmails);


  const handleSelectChange = (e) => {
    setCampaignType(e.target.value);
    setCampaignEmails([]);
  };

  let campaignEmailsInputString = useMemo(()=>{
    let inputString=``;
    campaignEmails.forEach(email=>{inputString=inputString+ `{Id:${email.id}, title:${email.title}, sendDate:${new Date(email.sendDate).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short'  })}}`})
    return inputString;
  },[campaignEmails])
  

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
      console.log('add', campaignEmails.findIndex((email)=>{return email.id==newEmail.id}))
      if(
        campaignEmails.findIndex((email)=>{return email.id==newEmail.id})!==-1
      )return;
      setCampaignEmails([...campaignEmails, newEmail])
    }

    const handleSaveCampaign = async()=>{
      if(titleRef.current.value=='' || campaignEmails.length==0)return;
      let sortedCapaignEmails= [...campaignEmails];
      if(campaignType=='campaign')
      sortedCapaignEmails=campaignEmails.sort((a, b) => a.sendDate - b.sendDate);

      let newCampaignData = {title:titleRef.current.value, campaignType:campaignType, emails:JSON.stringify(sortedCapaignEmails.map((email)=>{
        if(campaignType=='campaign')
        return {id:email.id, sendDate:email.sendDate, sent:false}
        else{return {id:email.id, sent:false}}
      }))
      
      };

    
     
      await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataType: 'send_new_capaign', data: newCampaignData }),
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            router.push('/admin/emails');
          }
        })

        .catch((error) => {console.log(error)});
    }


  return (
    <div className={styles.mainDiv}>
      <h1>New email campaign</h1>
      <select
        id="campaignTypeSelect"
        className={styles.campaignTypeSelect}
        value={campaignType}
        onChange={handleSelectChange}
      >
         <option value="campaign">Campaign</option>
        <option value="sequence">Sequence</option>
       
      </select>

      <input ref={titleRef} className={styles.campaignInput} placeholder='Campaign title'/>
      <input value={campaignEmailsInputString} className={styles.campaignInput} placeholder='Included emails'/>
      <EmailList emailData={emailData} addEmail={addEmail} campaignType={campaignType}/>
      <button className={styles.saveCampaign} onClick={handleSaveCampaign}>Save campaign</button>
      </div>

  )
}
