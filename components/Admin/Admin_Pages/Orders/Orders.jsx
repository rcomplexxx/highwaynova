import GetDataButton from "../MagicButtons/GetDataButton";
import UpdateDataButton from "../MagicButtons/UpdateDataButton";
import OrderCard from "./OrderCard/OrderCard";
import { useState } from "react";
import styles from "./orders.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";
import { useAdminStore } from "../../AdminZustand";




export default function Orders() {
  
  
  const [page, setPage] = useState(0);



    const {orders, setOrders } = useAdminStore();
  



  const handleChangedOrdersArray = (changedOrder) => {

    
    

    const updatedOrders = orders.map(order => order.id === changedOrder.id ?{...order, ...changedOrder, changed: true}:order)

  
    
    setOrders(updatedOrders)
 

    


  };


 
  
  



  

  

  
  

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Orders</h1>
        {orders.length !== 0 ? (
          <UpdateDataButton
          dataName={'orders'}
            dataType="update_orders"
           
            newData={orders.filter(order => order.changed)}
            
            
            
          />
        ) : (
          <div className={styles.getButtonsWrapper}>


<GetDataButton
          name="orders - NEW"
          dataType={"get_unfulfilled_orders"}
          setData={setOrders}
          
        />


<GetDataButton
              name="orders - ORDERED"
              dataType={"get_ordered_orders"}
              setData={setOrders}
              
            />

<GetDataButton
              name="orders - COMPLETED"
              dataType={"get_completed_orders"}
              setData={setOrders}
              
            />
     
     




            <GetDataButton
              name="Orders - UNAPPROVED"
              dataType={"get_unapproved_orders"}
              setData={setOrders}
              
            />

<GetDataButton
              name="Orders - CANCELED"
              dataType={"get_canceled_orders"}
              setData={setOrders}
            />


<GetDataButton
              name="orders - RETURNED"
              dataType={"get_returned_orders"}
              setData={setOrders}
              
            />



          </div>
        )}
      </div>
     
     <div className={styles.orders}>
      
     {orders.slice(page * 10, (page + 1) * 10).map((order, index) => (
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

</div>
      

      <PageIndexButtons data={orders} page={page} setPage={setPage} />
    </>
  );
}
