import { adminCopycat } from "@/utils/utils-client/utils-admin/adminCopycat";
import styles from "./messagecard.module.css";
import { useState } from "react";

export default function MessageCard({
 
  
  index,
 
  
  messageInfo: { id, name, email, totalOrderCount, message},
  msgStatus,
  handleChangedMessagesArray,
}) {

  
const [currentStatus, setCurrentStatus] = useState(msgStatus);





  const changeMsgStatus = () => {

    console.log('changing status.')

    const nextStatus = currentStatus === 2 ? 0 : currentStatus + 1;
    setCurrentStatus(nextStatus);
    handleChangedMessagesArray({ id, msgStatus: nextStatus });

   
  };

  return (
    <div className={styles.cardMainDiv}>


      <div className={styles.mainInfo}>
      <span className={styles.identifier}>{index + 1}</span>
      <div className={styles.infoPair}>
         <p className={styles.infoLabel}>Name</p>
         <p className={styles.info}>{name}</p>
      </div>

    

      <div className={styles.infoPair}>
         <p className={styles.infoLabel}>Order count</p>
         <p className={styles.info}>{totalOrderCount}</p>
      </div>

     
      <div className={styles.infoPair}>
         <div className={styles.infoLabelWrapper}>
          <p className={styles.infoLabel}>Email</p> 
         <span onClick={async(e)=>{if(await adminCopycat(email))  e.target.innerHTML = 'Email copied!'}} className={styles.copySpan}>
          Click here to copy email</span></div>
         <p className={styles.info}>{email}</p>
      </div>

     

   
      <button onClick={changeMsgStatus}>
        {currentStatus === 0
          ? "Not Answered"
          : currentStatus === 1
          ? "Answered"
          : "Archived"}
      </button>
      </div>

      <div className={`${styles.infoPair} ${styles.messagePair}`}>
         <p>Message</p>
         <p>{message}</p>
      </div>
     
     
    </div>
  );
}
