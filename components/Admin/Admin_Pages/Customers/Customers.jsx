import GetDataButton from "../MagicButtons/GetDataButton";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";
import styles from "./customers.module.css";
import { useState } from "react";

export default function Customers({ customers, setCustomers }) {



  const [page, setPage] = useState(0);
 


  

  

  return (
    <>
      <h1>Customers</h1>

       
      <div className={styles.customersMain}>
      
      {



customers.length === 0?
<div className={styles.getButtonsWrapper}>
  <GetDataButton
    name="Customers"
    dataType={"get_customers"}
    setData={setCustomers}
    
  />

<GetDataButton
  name="Customers bh"
  dataType={"get_customers_bh"}
  setData={setCustomers}
  
/>

</div>
:
<> <button className={styles.dismissCustomersButton} onClick={()=>{setPage(0);setCustomers([])}}>
Dismiss customer list
</button>

<div className={styles.customerGrid}>
{customers.slice(page * 30, (page + 1) * 30).map((customer,index)=> 

<CustomerCard key={page * 30 + index} index={page * 30 + index+1} customerInfo = {customer}/>
   
)}

</div>


</>
}
      </div>

      
      <PageIndexButtons data={customers} elementsPerPage = {30} page={page} setPage={setPage} />
    </>
  );
}



const CustomerCard = ({ index, customerInfo: { id, email, totalOrderCount, money_spent, source, used_discounts, createdDate } })=>{

  

  return <div className={styles.customersRowWrapper}>
  <h1 className={styles.identifier}>{index}</h1>
  
      <div className={styles.customerCardPair}>
        <span>Email</span>
      <span>{email}</span>
      </div>

    
    


      <div className={styles.customerCardPair}>
      <span>Order number | Money spent</span>
      <span>{totalOrderCount} | {money_spent}</span>
      </div>

      
      

      <div className={styles.customerCardPair}>

      <span>Source</span>
      
      <span>{source}</span>
      </div>


      {<div className={styles.customerCardPair}>
      <span>Used coupons</span>
      <span>{used_discounts==='[]'?'N/A':used_discounts}</span>
      </div>
      }
    
    
      </div>

}