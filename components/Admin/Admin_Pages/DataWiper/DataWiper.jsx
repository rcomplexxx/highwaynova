import { useRef, useState } from 'react'
import styles from './datawiper.module.css'
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';

export default function DataWiper() {

const [productId, setProductId] = useState();
const [verified, setVerified] = useState(false);
const [dataWipedTable , setDataWipedTable] = useState("");

const usernameRef=  useRef();
const passwordRef= useRef();


const handleVerify = async(event)=>{
    event.preventDefault();
    try {
      const response = await fetch("/api/adminlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setVerified(true);
      } else {
        
        return adminAlert('error', 'Admin verification failed', data.error);
      }
    } catch (error) {
      return adminAlert('error', 'Admin verification failed', `Can't process your verification request at the moment.`);
    }
}




const handleWipeData = async(databaseTable)=>{

  if(!verified) return adminAlert('error', 'Error', `Needs admin verification to continue wiping data.`);  

  
  

  if (databaseTable === 'reviews' && (isNaN(Number(productId))) && productId!=="All" ) return adminAlert('error', 'Error', `Required to enter productId or 'All'(for wiping all reviews) to continue.`);  
  
  

  if (!await adminConfirm('Warning! Data cannot be recovered. Do you still wish to proceed?')) return;


  console.log('wiping')

 
     try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: `wipe_${databaseTable}`, data: databaseTable === 'reviews' ? { product_id: productId } : undefined }),
    });

    if (!response.ok) throw new Error('Data wiping error')
      const {data_wiped} = await response.json();
      if (!data_wiped) return;
      
        console.log('Data wiped:', data_wiped);
        setDataWipedTable(databaseTable);
      
    
  } catch (error) {
    console.error('Wipe data error:', error);
  }



}





if(dataWipedTable && dataWipedTable!=="")return  <div className={styles.mainDiv}>
<h1>Data wiper</h1>
<span className={styles.dataWipedSuccessfully}>{`Data from table ${dataWipedTable} is deleted successfuly.`}</span>
</div>



  return (
    <div className={styles.mainDiv}>
        <h1>Data wiper</h1>
        <span className={styles.warning}>Warning! Dangerous operation. Once deleted, data can never be recovered.{!verified && <><br />Admin verification required to execute operation.</>}</span>
   
        {!verified?<form onSubmit={handleVerify} className={styles.loginBox}>
        <input type="text" placeholder="Username" ref={usernameRef} required />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          required
        />
        <button className={styles.verify} type="submit">Verify</button>
      </form>:<span className={styles.adminVerified}>Admin verified. Operation can be executed.</span>}


        <button onClick={()=>{handleWipeData("orders")}} className={styles.wipeButton}>Wipe orders</button>
        <button onClick={()=>{handleWipeData("messages")}} className={styles.wipeButton}>Wipe inbox</button>
        <button onClick={()=>{handleWipeData("product_returns")}} className={styles.wipeButton}>Wipe product returns</button>
        
        <span className={styles.enterIdSpan}>Enter id of product to wipe reviews from, or enter "All" to wipe all reviews</span>
        <input
            id="product_id"
            className={styles.reviewIdInput}
            value={productId}
            placeholder="Enter id"
            onChange={(event) => {
              const inputNumber = event.target.value;
               setProductId(inputNumber);
            }}
          />

        <button onClick={()=>{handleWipeData("reviews")}} className={`${styles.wipeButton} ${styles.wipeReviews}`}>Wipe reviews</button>
  
        <button onClick={()=>{handleWipeData("emails")}} className={`${styles.wipeButton} ${styles.marginTop}`}>Wipe emails</button>
        <button onClick={()=>{handleWipeData("email_sequences")}} className={styles.wipeButton}>Wipe email sequences</button>
        <button onClick={()=>{handleWipeData("email_campaigns")}} className={styles.wipeButton}>Wipe email campaigns</button>

        <button onClick={()=>{handleWipeData("customers")}} className={`${styles.wipeButton} ${styles.wipeCustomers}`}>Wipe customers</button>
  
    </div>
  )
}
