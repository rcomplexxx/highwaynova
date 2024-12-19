import  { useEffect, useState } from 'react'
import styles from './newcampaign.module.css'
import {useRouter} from 'next/router'
import SequenceList from './SequenceList/SequenceList';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';















export default function NewCampaign({sequences, setEmailData}) {



  const [explainTargetTraffic, setExplainTargetTraffic] = useState(false);

  const [markTraffic, setMarkTraffic] = useState("mark_with_current_campaign"); 
  const [targetTraffic, setTargetTraffic]= useState();
  const [sendDate, setSendDate] = useState();
  const [linkedSequenceId, setLinkedSequenceId] = useState();
  const [title, setTitle] = useState();
 


  const router = useRouter();



  console.log('my sequences~!', sequences);


  

    useEffect(()=>{
      if (!sequences?.length) {
        (async () => {
          try {
            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ dataType: 'get_emails' }),
            });
      
            if (!response.ok)  throw new Error("Network response was not ok.");
            
              const {data} = await response.json();
              console.log("Main DATA!!!!!", data);
              setEmailData(data);
            
          } catch (error) {
            console.error("Fetch operation problem:", error);
          }
        })();
      }
    },[])

  

    const handleSaveCampaign = async()=>{

      


  
   

      let newCampaignData = {title:title, sequenceId: linkedSequenceId, sendingDateInUnix:sendDate,
        targetType: targetTraffic,
        targetCustomers: targetTraffic, markTraffic: markTraffic
      };

    
     
      try {
        const response = await fetch("/api/admincheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataType: 'insert_new_campaign', data: newCampaignData }),
        });
        
        if (!response.ok) return;
          setTitle()
          router.push('/admin/emails');
      } catch (error) {
        console.log(error);
      }
    }



  

  return (
    <>
    <h1>New email campaign</h1>
    <div className={styles.mainDiv}>
      
    

      <input onChange={(event)=>{setTitle(event.target.value)}} className={styles.campaignInput} placeholder='Campaign title'/>

      <div className={styles.campaignPropertiesWrapper}>





      <div className={styles.targetTrafficDivWrapper}>

      <select
        id="targetTrafficSelect"
        className={styles.targetTrafficSelect}
        value={targetTraffic}
        onChange={(e) => {setTargetTraffic(e.target.value)}}
      >
         <option value={undefined}>Select target traffic</option>
        <option value="cold_traffic">Cold traffic (0-1)</option>
        <option value="warm_traffic">Warm traffic (2)</option>
        <option value="hot_traffic">Hot traffic (3-5)</option>
        <option value="loyal_traffic">Loyal traffic (5+)</option>
        <option value="all">All</option>
        <option value="bh_customers">Bh customers</option>
      </select>



      <select
        id="markTargetsSelect"
        className={styles.targetTrafficSelect}
        value={markTraffic}
        onChange={(e) => {setMarkTraffic(e.target.value)}}
      >
         <option value={undefined}>Select mark on targets</option>
        <option value={undefined}>No mark</option>
        <option value="mark_with_current_campaign">Mark with current campaign</option>
     
     
      </select>

   

      </div>





  



     <DatePicker multiple={false}
            plugins={[
                <TimePicker format="HH:mm:ss" position="bottom" />
              ]}

              onChange={(date) => {
           
                setSendDate(date.unix*1000)
              }}

              placeholder='Pick campaign sending date'

            // onChange={(date)=>{
             
            //   setEmailSendDate(date.unix*1000)}}
            minDate={Date.now()} 
            format="MM/DD/YYYY HH:mm:ss"  
            className={`bg-dark ${styles.datePicker}`}
    inputClass={styles.dateInput}
   />




   </div>

   <div className={styles.explainDivWrapper}>

   <button onClick={()=>{setExplainTargetTraffic(!explainTargetTraffic)}} className={styles.explainTargetTrafficButton}>Explain target traffics</button>

   
             {explainTargetTraffic && <div className={styles.targetTrafficExplanationWrapper}>

               <span>Cold traffic - Subscribed users who bought 0-1 times</span>
               <span>Warm traffic - Subscribed users who bought 2 times</span>
               <span>Hot traffic - Subscribed users who bought 3-5 times</span>
               <span>Loyal traffic - Subscribed users who bought 5+ times</span>
               <span>All - All subscribed users</span>
               <span>Bh traffic - not subbed yet, bh obtained users</span>
           
              </div>
            }

</div>

     {/* <div className={styles.linkedSequenceDiv}>Please link the sequence to create campaign</div> */}
     {linkedSequenceId ?<div className={styles.linkedSequenceDiv}>
     <span>Sequence with id {linkedSequenceId} linked</span>
      <button onClick={()=>{setLinkedSequenceId()}}>Unlink sequence</button>
      </div>
      :
     <SequenceList sequenceData={sequences} linkSequence={(id)=>{setLinkedSequenceId(id)}} />}


    
    {title && targetTraffic && sendDate && linkedSequenceId &&  <button className={styles.runCampaign} onClick={handleSaveCampaign}>Run campaign</button>}
      </div>

      </>

  )
}
