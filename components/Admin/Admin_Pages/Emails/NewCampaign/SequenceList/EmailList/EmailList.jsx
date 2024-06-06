import { useEffect, useState } from 'react'
import styles from './emaillist.module.css'
import EmailCard from '../../../EmailCard/EmailCard';

export default function EmailList({emails}) {

    const [allEmailsData, setAllEmailsData] = useState();



    useEffect(()=>{
        if(emails && !allEmailsData){

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
                  console.log("Maine DATA!!!!!", data);
                  //Ovde takodje zatraziti emails campaign kasnije .
                  //na slican princip kao sto sam trazio emails.
                  setAllEmailsData(data.data.emails);
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
    },[emails, allEmailsData]);


    const makeEmailCard = (email) =>{

        const myEmail= allEmailsData?.find(email2 => {return email2.id==email.id});
        if(!myEmail)return;

        return <EmailCard id={myEmail.id} title={myEmail.title} text={myEmail.text}/>
    }


       
                
               

        


        // id,title, text, allEmailsData?.find(email => {return email2.id==email.id})?.text
    
    



  

    return <div className={styles.emailListWrapper}>

{emails.map(email => {
            return <div> {email.sendTimeGap && <div className={styles.timeGapDiv}>Delay after last email sent: {(email.sendTimeGap / (24*60*60 *1000)).toFixed(2)} days</div>} {makeEmailCard(email)} </div>

                  })}
    </div>

}
