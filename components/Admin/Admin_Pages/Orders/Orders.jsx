import GetDataButton from "../MagicButtons/GetDataButton";
import SaveOrdersButton from "../MagicButtons/SaveOrdersButton";
import OrderCard from "./OrderCard/OrderCard";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";
import products from '@/data/products.json'
import coupons from '@/data/coupons.json'

export default function Orders({ data, setData }) {
  const [changedOrdersArray, setChangedOrdersArray] = useState([]);
  const [page, setPage] = useState(0);
  



  const handleChangedOrdersArray = (changedOrder) => {
    const updatedChangedOrdersArray = [...changedOrdersArray].filter(status => {
      return status.id !== changedOrder.id
    });

    updatedChangedOrdersArray.push(changedOrder)
 

    setChangedOrdersArray(updatedChangedOrdersArray);


  };

  const clearAfterDataSave = () => {
    setChangedOrdersArray([]);
    setPage(0);
  };

  const initializePackageStatusData = (data) => {
   
  };
  

  
  if (data.length === 1 && data[0] === "No orders")
    return (
      <>
        <h1>Orders</h1>
        <GetDataButton
          name="Orders"
          dataType={"get_unfulfilled_orders"}
          setData={setData}
          initializeData={initializePackageStatusData}
        />
        <p>All orders fulfilled for now.</p>
      </>
    );

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Orders</h1>
        {data.length !== 0 ? (
          <SaveOrdersButton
            dataType="send_unfulfilled_orders"
           
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
          initializeData={initializePackageStatusData}
        />


<GetDataButton
              name="orders - ORDERED"
              dataType={"get_ordered_orders"}
              setData={setData}
              initializeData={initializePackageStatusData}
            />

<GetDataButton
              name="orders - COMPLETED"
              dataType={"get_completed_orders"}
              setData={setData}
              initializeData={initializePackageStatusData}
            />
     
     
     <GetDataButton
              name="orders - RETURNED"
              dataType={"get_returned_orders"}
              setData={setData}
              initializeData={initializePackageStatusData}
            />



            <GetDataButton
              name="Orders - UNAPPROVED"
              dataType={"get_unapproved_orders"}
              setData={setData}
              initializeData={initializePackageStatusData}
            />




          </div>
        )}
      </div>
     
      {data.length !== 0 && data.length >= page * 10 && (
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
                id={order.id}
                info={
                  JSON.stringify({id:order.id, email:order.email, firstName:order.firstName, lastName:order.lastName, address:order.address, apt: order.apt, country: order.country, zipcode:order.zipcode, state:order.state, city:order.city, phone: order.phone, couponCode:order.couponCode,
                tip:order.tip,items:order.items, paymentMethod: order.paymentMethod,paymentId:order.paymentId })}
               
                packageStatus={data[index + page * 10].packageStatus}
                existingSupplierCosts = {data[index + page * 10].supplyCost}
                handleChangedOrdersArray={handleChangedOrdersArray}
                products={products}
                coupons={coupons}
              />
            ))}
        </>
      )}

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
