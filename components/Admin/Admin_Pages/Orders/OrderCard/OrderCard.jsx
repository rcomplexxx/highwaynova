import styles from "./ordercard.module.css";
import {  useMemo, useState } from "react";
import SupplierCostInput from "./SupplierCostInput/SupplierCostInput";
import products from '@/data/products.json'
import coupons from '@/data/coupons.json'
import Image from "next/image";

export default function OrderCard({
   index,
   
  info,
 
  packageStatus,
  existingSupplierCosts,
  handleChangedOrdersArray= ()=>{},
  productReturnsPageStyle=false
}) {


   const [cover, setCover]= useState({customerInfo: true, transaction: true, paymentId: true});


  
  
  
  const [supplierCostInputOpen, setSupplierCostInputOpen] = useState(false);
  const [supplierCost, setSupplierCost] = useState('');

  const [currentPackageStatus, setCurrentPackageStatus] = useState(packageStatus);
  


  const infoObj = useMemo(() => {
   const { items, couponCode, ...rest } = info;
   const newItems = JSON.parse(items || "[]").map(item => ({
     ...item, 
     images: products.find(product => product.id == item.id)?.images
   }));
   
   const discountPercentOff = coupons.find(c => c.code.toUpperCase() === couponCode?.toUpperCase())?.discountPercentage;
 
   return { ...rest, items: newItems, discountPercentOff };
 }, [info, products, coupons]);




   





 


const changePs = () => {
   if (currentPackageStatus === 4) return;
 
   if (currentPackageStatus === 0) {
     setSupplierCostInputOpen(true);
   } else {
      const nextStatus = currentPackageStatus < 3 ? currentPackageStatus + 1 : 0;
     setCurrentPackageStatus(nextStatus);
 
     const update = { id: infoObj.id, packageStatus: nextStatus };
     if (currentPackageStatus === 1 && packageStatus === 0) {
       update.supplierCost = parseFloat(supplierCost).toFixed(2);
     }
 
     handleChangedOrdersArray(update);
   }
 };

 const statusLabels = ["Not Ordered", "Ordered", "Completed", "Canceled", "Returned"];

 


  return (
    <div className={`${styles.cardMainDiv} ${productReturnsPageStyle && styles.productReturnsPageStyle}`}>

    
      <div className={styles.cardRow}>
      <span className={styles.identifier}>{index+1}</span>
    

      <p className={styles.orderId}>Order_id {infoObj.id}</p>

      <button className={styles.packageStatusButton} onClick={changePs}>{statusLabels[currentPackageStatus] || "Undefined"}</button>

      
      </div>


      <div className={styles.cardRow}>
        <h1 className={styles.rowTitle}>Customer info</h1>
      <div className={styles.infoRowDiv}>
         {cover.customerInfo?<span onClick={()=>{setCover(prevCover => ({...prevCover, customerInfo: false}))}} 
   className={styles.fieldCovered}>Click for details</span>:<>
      <div className={styles.infoPair}>
         <p>Email</p>
         <p>{infoObj.email}</p>
      </div>
      <div className={styles.infoPair}>
         <p>First name</p>
         <p>{infoObj.firstName}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Last name</p>
         <p>{infoObj.lastName}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Phone</p>
         <p>{infoObj.phone}</p>
      </div>







      <div className={styles.infoPair}>
         <p>Address</p>
         <p>{infoObj.address}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Apt</p>
         <p>{infoObj.apt || '______'}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Country</p>
         <p>{infoObj.country}</p>
      </div>

      <div className={styles.infoPair}>
         <p>State</p>
         <p>{infoObj.state}</p>
      </div>

      <div className={styles.infoPair}>
         <p>City</p>
         <p>{infoObj.city}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Zip code</p>
         <p>{infoObj.zipcode}</p>
      </div>
      </>}

      

      </div>
      </div>




    
    

      <div className={styles.cardRow}>
      <h1 className={`${styles.rowTitle} ${styles.itemsRow}`}>Items</h1>
      <div className={`${styles.infoRowDiv} ${styles.itemsMiniRow}`}>


      {infoObj.items?.map((item, index)=>{
        return <div key={index} className={`${styles.cardRow} ${styles.itemInfoRow} ${styles.cardRowNoBorder}`}>

         <div className={styles.groupedInfo}>
   

<Image
   src={`/images/${item.images[0]}`}
   alt={item.name}
   className={styles.productImage}
   height={0} width={0} sizes="72px"
 />


        <div className={styles.infoPair}>
         <p>Name</p>
         <p>{products.find(product=>{return item.id==product.id}).name}</p>
      </div>

      </div>

   

      <div className={styles.infoPair}>
         <p>Variant</p>
         <p>{item.variant}</p>     
          </div>

         <div className={styles.infoPair}>
         <p>Quantity</p>
         <p>{item.quantity}</p>
      </div>
{/* 
      <div className={styles.infoPair}>
         <p>Product Link</p>
         <p>Under construction</p>
      </div> */}
 
   </div>
      })
     

  }

  
  </div>
   </div>
   <div className={`${styles.cardRow} ${styles.cardRowNoBorder}`}>
      <h1 className={styles.rowTitle}>Transaction</h1>


     <div className={`${styles.infoRowDiv}  ${styles.transactionInfoDiv} ${cover.transaction && styles.transactionInfoDivCovered}`}>

     <div className={`${styles.infoPair}`}>
         <p>Total{(infoObj.discountPercentOff && infoObj.tip!=0) ?'(tip & disc. included)':(infoObj.discountPercentOff?'(discount included)':
         infoObj.tip && infoObj.tip!=0 && '(tip included)')}</p>
         <p>{infoObj.total}</p>


         
      </div>

    
    



  { cover.transaction ? <span onClick={()=>{setCover(prevCover => ({...prevCover, transaction: false}))}} 
   className={styles.fieldCovered}>Click for details</span> :<> 
  
  
   {  existingSupplierCosts >0 && <div className={styles.infoPair}>
         <p>Supply costs</p>
         <p>{existingSupplierCosts}</p>
      </div>}
  
  {infoObj.discountPercentOff && 
     <div className={styles.infoPair}>
         <p>Discount ({infoObj.discountPercentOff}%)</p>
         <p>{(infoObj.discountPercentOff*(infoObj.total-infoObj.tip) / (100 - infoObj.discountPercentOff)).toFixed(2)}</p>
      </div>
}



{infoObj.tip && infoObj.tip!=0 &&
     <div className={styles.infoPair}>
         <p>Tip</p>
         <p>{infoObj.tip}</p>
      </div>
}
      
     <div className={styles.infoPair}>
         <p>Payment method</p>
         <p>{infoObj.paymentMethod}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Payment id</p>
         <p onClick={() => setCover(prevCover => ({ ...prevCover, paymentId: false }))} className={cover.paymentId && styles.paymentIdCovered}>{cover.paymentId?'Click for details':infoObj.paymentId}</p>
      </div>

      </> 
}

      
      </div>
      </div>
      {supplierCostInputOpen && <SupplierCostInput
      
      supplierCost={supplierCost} setSupplierCost={setSupplierCost}
      handleChangedOrdersArray={(supplierCost)=>{
         setCurrentPackageStatus(1);
         handleChangedOrdersArray({id: infoObj.id, packageStatus:1, supplierCost: supplierCost})}} setSupplierCostInputOpen={setSupplierCostInputOpen}/>}
      </div>


  );
}
