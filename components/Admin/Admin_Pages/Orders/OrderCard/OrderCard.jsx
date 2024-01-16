import styles from "./ordercard.module.css";
import { useEffect, useMemo, useState } from "react";

export default function OrderCard({
  id,
  info,
 
  packageStatus,
  handlePackageStatusChange,
  products,
  coupons
}) {
  const [transactionCovered, setStransactionCovered]= useState(true);
  const [paymentIdCovered, setPaymentIdCovered] = useState(true);
  const [amount, setAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState();
  const [discountInCash, setDiscoutInCash] = useState();


   const infoObj = useMemo(() => JSON.parse(info), [info]);


    useEffect(()=>{


     

    
      let rawAmount =0;

         console.log('inf',info);
         const infoObj =  JSON.parse(info);
                const items = JSON.parse(infoObj.items)
              
               
              items.forEach((item) => {
                  const product = products.find((p) => p.id === item.id);
                
                  if (product) {
                    const price = product.price * parseInt(item.quantity, 10);
                    rawAmount=rawAmount+price;
                  }
                });
              

              


              console.log(rawAmount);
              console.log('ccCode', infoObj.discountCode)
                if(infoObj.discountCode){
      const myCoupon= coupons.find((c)=>{return infoObj.discountCode==c.code.toUpperCase()})
      console.log('coupon', myCoupon);
      const myDiscountPercent= myCoupon.discountPercentage;

     

      const myDiscountInCash = (rawAmount*myDiscountPercent/100).toFixed(2);
      let myAmount = rawAmount - myDiscountInCash;
     

      setDiscountPercent(myDiscountPercent);
      setDiscoutInCash(myDiscountInCash);
      myAmount = myAmount.toFixed(2)
      setAmount(myAmount);
                }
                else{
                  setAmount(rawAmount.toFixed(2))
                }

               
    },[])





 


  const changePs = () => {
    packageStatus === "0"
      ? handlePackageStatusChange(id, "1")
      : packageStatus === "1"
      ? handlePackageStatusChange(id, "2")
      : handlePackageStatusChange(id, "0");
  };

  return (
    <div className={styles.cardMainDiv}>
      <div className={styles.cardRow}>
      <h1 className={styles.identifier}>{id + 1}</h1>
    

      <p className={styles.orderId}>Order_id {infoObj.id}</p>

      <button className={styles.packageStatusButton} onClick={changePs}>
        {packageStatus === "0"
          ? "Not Ordered"
          : packageStatus === "1"
          ? "Ordered"
          : "Completed"}
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
        return <div className={`${styles.cardRow} ${styles.itemInfoRow} ${styles.cardRowNoBorder}`}>
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
         <p>Total{discountPercent && ' (discount included)'}</p>
         <p>{amount}</p>
      </div>

    <div onClick={()=>{setStransactionCovered(false)}} 
    className={`${styles.transactionCoverableDiv} ${!discountPercent && styles.transactionCoverableDivNoDisc} ${
      transactionCovered && styles.transactionCovered
    }`}>

  { transactionCovered ? <span>Click to see details</span> :<> {infoObj.discountCode && discountPercent && discountInCash &&
     <div className={styles.infoPair}>
         <p>Discount ({discountPercent}%)</p>
         <p>{discountInCash}</p>
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
