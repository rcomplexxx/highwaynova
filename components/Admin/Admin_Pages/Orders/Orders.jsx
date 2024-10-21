import GetDataButton from "../MagicButtons/GetDataButton";
import SaveOrdersButton from "../MagicButtons/SaveOrdersButton";
import OrderCard from "./OrderCard/OrderCard";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";




export default function Orders({ data, setData }) {
  
  const [page, setPage] = useState(0);


  useEffect(()=>{
    if(data.length===0)setPage(0);
  },[data])
  



  const handleChangedOrdersArray = (changedOrder) => {

    
    

    const updatedOrders = data.map(order => order.id === changedOrder.id ?{...order, ...changedOrder, changed: true}:order)

  
    
    setData(updatedOrders)
 

    


  };


 
  
  



  

  

  
  

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Orders</h1>
        {data.length !== 0 ? (
          <SaveOrdersButton
            dataType="update_orders"
           
            newData={data.filter(order => order.changed)}
            setData={setData}
            
          />
        ) : (
          <div className={styles.getButtonsWrapper}>


<GetDataButton
          name="orders - NEW"
          dataType={"get_unfulfilled_orders"}
          setData={setData}
          
        />


<GetDataButton
              name="orders - ORDERED"
              dataType={"get_ordered_orders"}
              setData={setData}
              
            />

<GetDataButton
              name="orders - COMPLETED"
              dataType={"get_completed_orders"}
              setData={setData}
              
            />
     
     




            <GetDataButton
              name="Orders - UNAPPROVED"
              dataType={"get_unapproved_orders"}
              setData={setData}
              
            />

<GetDataButton
              name="Orders - CANCELED"
              dataType={"get_canceled_orders"}
              setData={setData}
              
            />


<GetDataButton
              name="orders - RETURNED"
              dataType={"get_returned_orders"}
              setData={setData}
              
            />



          </div>
        )}
      </div>
     
      
      {data.slice(page * 10, (page + 1) * 10).map((order, index) => (
  <OrderCard
    key={page * 10 + index}
    index={page * 10 + index}
   
    
    info={{id:order.id, email:order.email, firstName:order.firstName, lastName:order.lastName, address:order.address, apt: order.apt, country: order.country, zipcode:order.zipcode, state:order.state, city:order.city, phone: order.phone, couponCode:order.couponCode,
      tip:order.tip,items:order.items, total: order.total, paymentMethod: order.paymentMethod,paymentId:order.paymentId }}
     
    packageStatus={order.packageStatus}
    existingSupplierCosts={order.supplyCost}
    handleChangedOrdersArray={handleChangedOrdersArray}
  />
))}
      

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
