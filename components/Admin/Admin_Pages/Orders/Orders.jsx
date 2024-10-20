import GetDataButton from "../MagicButtons/GetDataButton";
import SaveOrdersButton from "../MagicButtons/SaveOrdersButton";
import OrderCard from "./OrderCard/OrderCard";
import { useState } from "react";
import styles from "./orders.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";




export default function Orders({ data, setData }) {
  const [changedOrdersArray, setChangedOrdersArray] = useState([]);
  const [page, setPage] = useState(0);
  



  const handleChangedOrdersArray = (changedOrder) => {

    

    const updatedChangedOrdersArray = changedOrdersArray.filter(order => {
      return order.id !== changedOrder.id
    });

    updatedChangedOrdersArray.push(changedOrder)

    
    console.log('changed order', changedOrdersArray)
 

    setChangedOrdersArray(updatedChangedOrdersArray);


  };

  const clearAfterDataSave = () => {
    setChangedOrdersArray([]);
    setPage(0);
  };

  

  
  

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Orders</h1>
        {data.length !== 0 ? (
          <SaveOrdersButton
            dataType="update_orders"
           
            newData={changedOrdersArray}
            setData={setData}
            clearAfterDataSave={clearAfterDataSave}
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
     
      {data.length > page * 10 && (
        <>
          {data
            .slice(
              page * 10,
              (page + 1) * 10 > data.length - 1
                ? data.length 
                : (page + 1) * 10,
            )
            
            .map((order, index) => (
              <OrderCard
                key={page * 10 + index}
                index={page * 10 + index}
               
                info={{id:order.id, email:order.email, firstName:order.firstName, lastName:order.lastName, address:order.address, apt: order.apt, country: order.country, zipcode:order.zipcode, state:order.state, city:order.city, phone: order.phone, couponCode:order.couponCode,
                tip:order.tip,items:order.items, total: order.total, paymentMethod: order.paymentMethod,paymentId:order.paymentId }}
               
                packageStatus={data[index + page * 10].packageStatus}
                existingSupplierCosts = {data[index + page * 10].supplyCost}
                handleChangedOrdersArray={handleChangedOrdersArray}
               
                
              />
            ))}
        </>
      )}

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
