import React, { useRef, useState } from 'react'
import styles from './datawiper.module.css'
import AdminNavbar from '../../Admin_Login/AdminLogin';

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
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
}


const handleWipeData = (databaseTable)=>{
  if(!verified) return;
  if(databaseTable=='reviews' && productId===undefined)return;


  console.log('wiping')

 
    fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: `wipe_${databaseTable}`, data: databaseTable=='reviews'?{product_id: productId}:undefined }),
    })
      .then((response) => {
        
        if (response.ok) {
          response.json()
        .then(data => {
            console.log(data);
            if(data.data_wiped)
            console.log('data wiped.')
            setDataWipedTable(databaseTable);
          
        })
        .catch(error => {
            console.error('Error parsing JSON:', error);
        });

      }
         
      })

      .catch((error) => {console.log('wipe data error', error)});



}

if(dataWipedTable && dataWipedTable!=="")return  <div className={styles.mainDiv}>
<h1>Data wiper</h1>
<span className={styles.dataWipedSuccessfully}>{`Data from table ${dataWipedTable} is deleted successfuly.`}</span>
</div>



  return (
    <div className={styles.mainDiv}>
        <h1>Data wiper</h1>
        <span className={styles.warning}>Warning! Dangerous operation. Once deleted, data can never be recovered again.</span>
        <span className={styles.warning}>Admin verification required before operation can be executed.</span>
        {!verified?<form onSubmit={handleVerify} className={styles.loginBox}>
        <input type="text" placeholder="Username" ref={usernameRef} required />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          required
        />
        <button type="submit">Verify</button>
      </form>:<span className={styles.adminVerified}>Admin verified. Operation can be initialized.</span>}
        <button onClick={()=>{handleWipeData("orders")}} className={styles.wipeButton}>Wipe orders</button>
        <button onClick={()=>{handleWipeData("messages")}} className={styles.wipeButton}>Wipe inbox</button>

        <span className={styles.enterIdSpan}>Enter id of product to wipe reviews from, or enter "All" to wipe allr reviews</span>
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
    </div>
  )
}
