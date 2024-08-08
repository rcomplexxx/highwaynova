import styles from "./messagecard.module.css";
import { useState } from "react";

export default function MessageCard({
  id,
  name,
  email,
  totalOrderCount,
  message,
  msgStatus,
  handleMsgStatusChange,
}) {

const [emailCopied, setEmailCopied] = useState(false);

  const changeMsgStatus = () => {
    msgStatus === 0
      ? handleMsgStatusChange(id, 1)
      : msgStatus === 1
      ? handleMsgStatusChange(id, 2)
      : handleMsgStatusChange(id, 0);
  };

  return (
    <div className={styles.cardMainDiv}>
      <div className={styles.mainInfo}>
      <h1 className={styles.identifier}>{id + 1}</h1>
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
         <span onClick={()=>{
          navigator.clipboard.writeText(email);
          setEmailCopied(true);
         }} className={styles.copySpan}>
          {!emailCopied?'Click here to copy email':'Email copied!'}</span></div>
         <p className={styles.info}>{email}</p>
      </div>

     

   
      <button className={styles.msgStatusButton} onClick={changeMsgStatus}>
        {msgStatus === 0
          ? "Not Answered"
          : msgStatus === 1
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
