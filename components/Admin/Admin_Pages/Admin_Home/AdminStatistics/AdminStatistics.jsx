import { useEffect, useState } from 'react';
import styles from './adminstatistics.module.css'
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import products from "@/data/products.json";
import coupons from "@/data/coupons.json"
import Charts from './Charts/Charts';


export default function AdminStatistics(){
    const [selectedRange, setSelectedRange] = useState([]);
    const [cashData, setCashData] = useState([]);

  
   



    // dataType={}
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                { dataType:"get_order_cash_info" }
              ),
            });
      
            if (response.ok) {
              const data = await response.json();
             


              
              const cashInfo = data.data.map(orderInfo => {
                //Ovde se nalazi cash info.
                const items = JSON.parse(orderInfo.items);
              
                let totalPrice=0;
                let supplierCosts=0;
                let tip = orderInfo.tip?orderInfo.tip:0;


                console.log('or in', orderInfo)
              items.forEach((item) => {


                
                  const product = products.find((p) => p.id === item.id);
                  console.log('coup', coupons)
                  const coupon = coupons.find(c=>{return c.code ==orderInfo.couponCode.toLowerCase()});

                  let discountPercentage = coupon?coupon.discountPercentage:0;

                  console.log('disc percentage', discountPercentage);
                
                  if (product) {
                    const price = product.price * parseInt(item.quantity, 10);
                    console.log('supp pr', product)
                    totalPrice=totalPrice+price;
                    if(discountPercentage)totalPrice=totalPrice - price  * discountPercentage /100;
                    supplierCosts += product.supplierPrice.product * parseInt(item.quantity, 10)  + product.supplierPrice.shipping;
                    
                    
                  }

                  console.log('Product data', product)


                });

                totalPrice= Number(totalPrice.toFixed(2));
                supplierCosts= Number(supplierCosts.toFixed(2));
                tip= parseFloat(tip, 2);

                console.log('testing total price', totalPrice)
                //Doradi popust
                //Doradi tip
             
              

          
               

                return ({createdDate: orderInfo.createdDate, cashObtained: totalPrice, supplierCosts:supplierCosts, tip:tip})

              }
              );
              setCashData(cashInfo);

              console.log('cash info', cashInfo)



                




            } else {
              throw new Error("Network response was not ok.");
            }
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
          }
        };
      
        fetchData();
      }, []);







      const StatField=(period,startPeriod, endPeriod)=>{
        
        if(!endPeriod){
          const today = new Date();
          const unixTimestampInDays = Math.floor(today / 86400000); // Convert milliseconds to days
          endPeriod= unixTimestampInDays;
        }
        if(!startPeriod){
          if(period=='Today') startPeriod=endPeriod;
          else if(period=='Last 7 days') startPeriod=endPeriod - 7;
          else if(period=='Last 30 days') startPeriod=endPeriod - 30;
          else if(period=='Last 365 days') startPeriod=endPeriod - 365;
          else if(period=='All time') startPeriod=0;
        }
        let orderNumber= 0;
        let customerCash= 0;
        let supplierCosts = 0;
        let tip = 0;
       
        if(cashData) {cashData.forEach(info=>{
            if(info.createdDate>=startPeriod && info.createdDate<= endPeriod){
              orderNumber=orderNumber+1;
             
              customerCash=customerCash+info.cashObtained
              console.log('curent cus price', customerCash)
              supplierCosts+=info.supplierCosts;
              tip+=info.tip;
          
            }

            


        });

        customerCash=customerCash.toFixed(2);
        supplierCosts=supplierCosts.toFixed(2);
        tip=tip.toFixed(2);
        let profit= Number(customerCash) - Number(supplierCosts)+Number(tip);
        profit=profit.toFixed(2);

        return <div className={styles.saleStat}>
        <span className={styles.statName}>{period}</span> 
         <span className={styles.statName}>{orderNumber}</span> 
        <span className={styles.statName}>${customerCash}</span> 
        <span className={styles.statName}>${tip}</span> 
        <span className={styles.statName}>${supplierCosts}</span> 
        <span className={styles.statName}>${profit}</span> 
        </div>
        }
        return <div className={styles.saleStat}>
        </div>
        
      }

      const CustomPeriodData= ()=>{



        let orderNumber= 0;
        let customerCash= 0;
        let supplierCosts = 0;
        let tip = 0;




        if(selectedRange.length===2) {cashData.forEach(info=>{
          if(info.createdDate>=selectedRange[0] && info.createdDate< selectedRange[1]){


              //=






        
       

              orderNumber=orderNumber+1;
             
              customerCash=customerCash+info.cashObtained
              console.log('curent cus price', customerCash)
              supplierCosts+=info.supplierCosts;
              tip+=info.tip;
        


              




          }
      });


      
      customerCash=customerCash.toFixed(2);
      supplierCosts=supplierCosts.toFixed(2);
      tip=tip.toFixed(2);
      let profit= Number(customerCash) - Number(supplierCosts)+Number(tip);
      profit=profit.toFixed(2);


      return {orderNumber, customerCash, supplierCosts, tip, profit}
      }
      else{
        return {orderNumber:'N/A', customerCash:'N/A', supplierCosts:'N/A', tip:'N/A', profit: 'N/A'}
      }
    };





    return <div className={styles.saleInfoDiv}>
    <h2 className={styles.saleInfoTitle}>Sale Information</h2>

<div className={styles.saleStats}>


    <div className={styles.saleStat}>
      <h2>Period</h2>
      <h2>Number of orders</h2>
      <h2>Customer cash (with discounts)</h2>
      <h2>Tips</h2>
      <h2>Supplier costs</h2>
      <h2>Profit</h2>
      </div>

      {StatField('Today')}
      {StatField('Last 7 days')}
      {StatField('Last 30 days')}
      {StatField('Last 365 days')}
      {StatField('All time')}
      
      <div className={styles.saleStat}>
    <div className={styles.datePickerWrapper}>



    <span className={styles.dateRangeLabel}>Pick a date range</span> 
    <DatePicker range format="DD/MM/YYYY"  className={`bg-dark ${styles.datePicker}`}
    inputClass={styles.dateInput}
    onChange={(value) => {
            if(value.length>1)
          setSelectedRange([ Math.floor(value[0].valueOf()/ 86400000),  Math.floor(value[1].valueOf()/ 86400000)+1]);
        else setSelectedRange([]);
          }}/>
          
</div>


<span className={styles.statName}>{CustomPeriodData().orderNumber}</span> 
        <span className={styles.statName}>${CustomPeriodData().customerCash}</span>
        <span className={styles.statName}>{CustomPeriodData().tip}</span> 
        <span className={styles.statName}>${CustomPeriodData().supplierCosts}</span>
        <span className={styles.statName}>{CustomPeriodData().profit}</span> 

</div>
      
        

    

    </div>


          <Charts title="Customer cash (with discounts)" chartData={cashData.map(item => {return {createdDate:item.createdDate, yMetric:item.cashObtained}})}/>

          <Charts title="Profit" chartData={cashData.map(item => {return {createdDate:item.createdDate, yMetric:Number(item.cashObtained) - Number(item.supplierCosts)+Number(item.tip)}})}/>

  

    </div>
}