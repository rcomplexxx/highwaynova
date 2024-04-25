import React from 'react'
import styles from './productreturns.module.css'

export default function ProductReturns() {
  return (
    <>
    <h1>Product returns</h1>



      <div className={styles.mainDiv}>



       
        <input
            id="product_id"
            className={styles.inputProductId}
            // value={productId}
            placeholder="Enter order id of order of returned product(s)"
            // onChange={(event) => {
            //   const inputNumber = event.target.value;
            //    setProductId(inputNumber);
            // }}
          />

        

        <button 
        // onClick={handleSaveDescription} 
        
        className={`${styles.saveDescription} ${styles.fileNewReturnButton}`}>File new return</button>
    
        


      <input
            id="product_id"
            className={styles.inputProductId}
            // value={productId}
            placeholder="Enter email to FIND associated orders"
            // onChange={(event) => {
            //   const inputNumber = event.target.value;
            //    setProductId(inputNumber);
            // }}
          />

        

        <button 
        // onClick={handleSaveDescription} 
        
        className={`${styles.saveDescription}`}>Find orders by email</button>


        <div className= {styles.ordersByEmailDiv}>


        </div>




      </div>
      </>
  )
}
