import GetDataButton from "../MagicButtons/GetDataButton";
import styles from "./customers.module.css";
import { useState } from "react";

export default function Customers({ customers, setCustomers }) {
  const initializeCustomersData = (data) => {
    console.log('data s', data)
    if (data && data.length == 0) setCustomers("No customers exist in database.");
 

    setCustomers(data);
  };

  if (customers && customers[0] === "No customers exist in database.")
    return (
      <>
        <h1>Customers</h1>
        <GetDataButton
          name="Customers"
          dataType={"get_customers"}
          setData={() => {}}
          initializeData={initializeCustomersData}
        />
        <p>Noone subscribed yet bro :/</p>
      </>
    );



  const renderEmailList = () => {

    if (customers.length === 0)
    return (
  <div className={styles.getButtonsWrapper}>
      <GetDataButton
        name="Customers"
        dataType={"get_customers"}
        setData={() => {}}
        initializeData={initializeCustomersData}
      />

<GetDataButton
      name="Customers bh"
      dataType={"get_customers_bh"}
      setData={() => {}}
      initializeData={initializeCustomersData}
    />

    </div>
    );
   
    console.log('subscr', customers)

    const customersLength = customers.length;
    
    return <> <button className={styles.dismissCustomersButton} onClick={()=>{setCustomers([])}}>
    Dismiss customer list
  </button>
  
  {customers?.map((customer,index)=>{
      if((index)%5==0){
        return <div className={styles.customersRowWrapper}>
        <h1 className={styles.identifier}>{index==0?index:index/5}</h1>
        <div className={styles.customersRow}>
        {[0,1,2,3,4].map((number) => {
          return customersLength>index+number?<div className={styles.customerPair}>
          <p key={index+number} className={styles.emailP}>Email: {customers[index+number]?.email}</p>
          <p key={index+number} className={styles.emailP}>Order number/Money spent: {customers[index+number]?.totalOrderCount}/{customers[index+number]?.money_spent}</p>
          <p key={index+number} className={styles.source}>Source: {customers[index+number]?.source}</p>
          </div> :<></>
        })}
        </div>
      </div>
      }
    })}</>

     

    
  };

  return (
    <>
      <h1>Customers</h1>

      <div className={styles.customersWrapper}>
       
      <div className={styles.customersMain}>
      
      {renderEmailList()}
      </div>
      </div>
    </>
  );
}
