import styles from "./ordercard.module.css";
import { useEffect, useMemo, useState } from "react";
import SupplierCostInput from "./SupplierCostInput/SupplierCostInput";

export default function OrderCard({
   index,
  id,
  total,
  info,
 
  packageStatus,
  existingSupplierCosts,
  handleChangedOrdersArray,
  products,
  coupons,
  productReturnsPageStyle=false
}) {


  const [transactionCovered, setStransactionCovered]= useState(true);
  const [paymentIdCovered, setPaymentIdCovered] = useState(true);
  
  const [discountPercent, setDiscountPercent] = useState();
  
  const [supplierCostInputOpen, setSupplierCostInputOpen] = useState(false);
  const [supplierCost, setSupplierCost] = useState('');

  const [currentPackageStatus, setCurrentPackageStatus] = useState(packageStatus);
  


   const infoObj = useMemo(() => JSON.parse(info), [info]);


    useEffect(()=>{

      console.log('ccCode', infoObj.couponCode)

      if(infoObj.couponCode){


         const myCoupon= coupons.find((c)=>{return infoObj.couponCode.toUpperCase()===c.code.toUpperCase()})
         console.log('coupon', myCoupon);
         const myDiscountPercent= myCoupon?myCoupon.discountPercentage:0;
   
        
   
       
         
         
   
         setDiscountPercent(myDiscountPercent);
         
       
         
                   }

   
                            

               
    },[])





 


  const changePs = () => {
   
   if(currentPackageStatus ===4) return;

    if(currentPackageStatus === 0) {setSupplierCostInputOpen(true)}


     //Ovaj deo je cudan>>>
    else if(currentPackageStatus===1){  setCurrentPackageStatus(2); 
      
      if(packageStatus===0)handleChangedOrdersArray({id: id, packageStatus:2, supplierCost: parseFloat(parseFloat(supplierCost).toFixed(2))})
      
      else handleChangedOrdersArray({id: id, packageStatus:2})
   
   }

  


    else if(currentPackageStatus===2){  setCurrentPackageStatus(3); handleChangedOrdersArray({id: id, packageStatus:3})}
    
    else if(currentPackageStatus===3){  setCurrentPackageStatus(0); handleChangedOrdersArray({id: id, packageStatus:0})}
  };

  return (
    <div className={`${styles.cardMainDiv} ${productReturnsPageStyle && styles.productReturnsPageStyle}`}>

      {supplierCostInputOpen && <SupplierCostInput
      
      supplierCost={supplierCost} setSupplierCost={setSupplierCost}
      handleChangedOrdersArray={(supplierCost)=>{
         setCurrentPackageStatus(1);
         handleChangedOrdersArray({id: id, packageStatus:1, supplierCost: supplierCost})}} setSupplierCostInputOpen={setSupplierCostInputOpen}/>}
      <div className={styles.cardRow}>
      <h1 className={styles.identifier}>{index+1}</h1>
    

      <p className={styles.orderId}>Order_id {infoObj.id}</p>

      <button className={styles.packageStatusButton} onClick={changePs}>
        {currentPackageStatus === 0
          ? "Not Ordered"
          : currentPackageStatus === 1
          ? "Ordered"
          : currentPackageStatus === 2? "Completed"
          : currentPackageStatus === 3 ? "Canceled"
          : currentPackageStatus === 4 ? "Returned"
          : "Undefined"}
      </button>
      </div>


      <div className={styles.cardRow}>
        <h1 className={styles.rowTitle}>Basic info</h1>
      <div className={styles.infoRowDiv}>
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

      </div>
      </div>
      <div  className={styles.cardRow}>
      <h1 className={styles.rowTitle}>Address</h1>
      <div className={styles.infoRowDiv}>


      <div className={styles.infoPair}>
         <p>Address</p>
         <p>{infoObj.address}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Apt</p>
         <p>{infoObj.apt?infoObj.apt:'______'}</p>
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

   

      </div>
      </div>

      <div className={styles.cardRow}>
      <h1 className={`${styles.rowTitle} ${styles.itemsRow}`}>Items</h1>
      <div className={`${styles.infoRowDiv} ${styles.itemsMiniRow}`}>
      {JSON.parse(infoObj.items)?.map((item, index)=>{
        return <div key={index} className={`${styles.cardRow} ${styles.itemInfoRow} ${styles.cardRowNoBorder}`}>
        <p className={styles.itemNumber}>Item {index+1 + ' →'}  </p>

        <div className={styles.infoPair}>
         <p>Name</p>
         <p>{products.find(product=>{return item.id==product.id}).name}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Quantity</p>
         <p>{item.quantity}</p>
      </div>

      <div className={styles.infoPair}>
         <p>Variant</p>
         <p>{item.variant}</p>
      </div>
 
   </div>
      })
     

  }
  </div>
   </div>
   <div className={`${styles.cardRow} ${styles.cardRowNoBorder}`}>
      <h1 className={styles.rowTitle}>Transaction</h1>
     <div className={`${styles.infoRowDiv}  ${styles.transactionInfoDiv} ${transactionCovered && styles.transactionInfoDivCovered}`}>

     <div className={`${styles.infoPair} ${transactionCovered? styles.shrinkTotal:styles.pumpTotal}`}>
         <p>Total{(discountPercent && infoObj.tip!=0) ?'(tip & disc. included)':(discountPercent?'(discount included)':
         infoObj.tip && infoObj.tip!=0 && '(tip included)')}</p>
         <p>{total}</p>


         
      </div>

    
    

    <div onClick={()=>{setStransactionCovered(false)}} 
    className={`${styles.transactionCoverableDiv} ${!discountPercent && styles.transactionCoverableDivNoDisc} ${
      transactionCovered && styles.transactionCovered
    }`}>

  { transactionCovered ? <span>Click for details</span> :<> 
  
  
   {  existingSupplierCosts >0 && <div className={styles.infoPair}>
         <p>Supply costs</p>
         <p>{existingSupplierCosts}</p>
      </div>}
  
  {infoObj.couponCode && discountPercent && 
     <div className={styles.infoPair}>
         <p>Discount ({discountPercent}%)</p>
         <p>{(discountPercent*(total-infoObj.tip) / (100 - discountPercent)).toFixed(2)}</p>
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
         <p onClick={()=>{setPaymentIdCovered(false)}} className={paymentIdCovered && styles.paymentIdCovered}>{paymentIdCovered?'Click to see':infoObj.paymentId}</p>
      </div>

      </> 
}
      </div>
      
      </div>
      </div>
      </div>


  );
}
