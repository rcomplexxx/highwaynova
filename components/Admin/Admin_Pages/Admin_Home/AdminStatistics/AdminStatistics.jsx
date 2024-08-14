import { useEffect, useState } from 'react';
import styles from './adminstatistics.module.css'
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import products from "@/data/products.json";
import coupons from "@/data/coupons.json"
import Charts from './Charts/Charts';
import Image from 'next/image';
import { CorrectIcon } from '@/public/images/svgs/svgImages';


export default function AdminStatistics(){
    const [selectedRange, setSelectedRange] = useState([]); //Modza ne treba selectedRange
    const [cashData, setCashData] = useState([]);
    const [returnCashData, setReturnCashData] = useState([]);
    const [revealStatsReadingInstructions, setRevealStatsReadingInstructions] = useState(false);
    const [showCharts, setShowCharts] = useState(true);
    const [customDateStats, setCustomDateStats] = useState({orderNumber:'N/A', customerCash:'N/A', discountLostMoney:'N/A', supplierCosts:'N/A', tip:'N/A',lostInReturns:'N/A', averageOrderValue:'N/A', profit: 'N/A'});
    const [shouldUseOnlyFulfilledOrders, setShouldUseOnlyFulfilledOrders]= useState(false);
  
   



    // dataType={}
    useEffect(() => {




      
        const fetchData = async () => {
          try {

            let returnCashInfo =[];



            const responseReturnCashInfo = await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                { dataType:"get_product_returns" }
              ),
            });

      
            if (responseReturnCashInfo.ok) {
              const data = await responseReturnCashInfo.json();
           
              if(data.data){

                returnCashInfo=data.data.map(productReturn=>{return {cashReturned: productReturn.cashReturned, createdDate: productReturn.createdDate}});
                setReturnCashData(returnCashInfo);
                

              }
             


              
          
              }

              console.log('return cash', returnCashInfo)
            



            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                { dataType:shouldUseOnlyFulfilledOrders?"get_order_cash_info_only_fulfilled_orders":"get_order_cash_info" }
              ),
            });
      
            if (response.ok) {
              const data = await response.json();
             


              
              const cashInfo = data.data.map(orderInfo => {
                //Ovde se nalazi cash info.
                const items = JSON.parse(orderInfo.items);
              
                let totalPrice=0;
                let tip = orderInfo.tip?orderInfo.tip:0;
                let discountLostMoney = 0;
                const supplierCost = orderInfo.supplierCost;


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
                    discountLostMoney= discountLostMoney+price  * discountPercentage /100;
                    if(discountPercentage)totalPrice=totalPrice - discountLostMoney;


                 
                    
                  }

                  console.log('Product data', product)


                });

                totalPrice= Number(totalPrice.toFixed(2));
                discountLostMoney= Number(discountLostMoney.toFixed(2));
              
                tip= parseFloat(tip, 2);


              
                



                console.log('testing total price', orderInfo)
                //Doradi popust
                //Doradi tip
             
              

          
               

                return ({createdDate: orderInfo.createdDate, cashObtained: totalPrice, discountLostMoney:discountLostMoney, supplierCosts:supplierCost, tip:tip})

              }
              );
              setCashData(cashInfo);

              console.log('cash info', cashInfo);




              
               
              



                




            } else {
              throw new Error("Network response was not ok.");
            }
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
          }
        };
      
        fetchData();
      }, [shouldUseOnlyFulfilledOrders]);







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
        let discountLostMoney=0;
       
        let supplierCosts = 0;
        let tip = 0;
       
        if(cashData) {cashData.forEach(info=>{
            if(info.createdDate>=startPeriod && info.createdDate<= endPeriod){
              orderNumber=orderNumber+1;
             
              customerCash=customerCash+info.cashObtained
              console.log('curent cus price', customerCash)
              discountLostMoney+= info.discountLostMoney;
              supplierCosts+=info.supplierCosts;
              tip+=info.tip;
          
            }

            


        });

        let lostInReturns = 0;

        if(returnCashData.length !=0){
          returnCashData.forEach(rcd =>{

          
          if(rcd.createdDate>=startPeriod && rcd.createdDate<= endPeriod)
          lostInReturns = lostInReturns + Number(rcd.cashReturned);

        }
        )
        }

        lostInReturns=lostInReturns.toFixed(2);

        console.log('lost in returns', lostInReturns);

        customerCash=customerCash.toFixed(2);
        supplierCosts=supplierCosts.toFixed(2);
        tip=tip.toFixed(2);
        let profit= Number(customerCash) - Number(supplierCosts)+Number(tip) - lostInReturns;
        
        profit=profit.toFixed(2);

        let averageOrderValue= orderNumber==0?0:(Number(profit) / Number(orderNumber));
        averageOrderValue=averageOrderValue.toFixed(2);




        return <div className={styles.saleStat}>
        <span className={styles.statName}>{period}</span> 
         <span className={styles.statName}>{orderNumber}</span> 
        <span className={styles.statName}>${customerCash}</span> 
        <span className={styles.statName}>${discountLostMoney}</span>
        <span className={styles.statName}>${tip}</span> 
        <span className={styles.statName}>${supplierCosts}</span> 
        <span className={styles.statName}>${lostInReturns}</span> 
        <span className={styles.statName}>${averageOrderValue}</span>
        <span className={styles.statName}>${profit}</span> 
        </div>
        }
        return <div className={styles.saleStat}>
        </div>
        
      }

      const customPeriodData= (selectedRange)=>{



        let orderNumber= 0;
        let customerCash= 0;
        let supplierCosts = 0;
        let tip = 0;
        let discountLostMoney= 0;




        cashData.forEach(info=>{
          if(info.createdDate>=selectedRange[0] && info.createdDate<= selectedRange[1]){


              //=






        
       

              orderNumber=orderNumber+1;
             
              customerCash=customerCash+info.cashObtained
              console.log('curent cus price', customerCash)
              supplierCosts+=info.supplierCosts;
              tip+=info.tip;
              discountLostMoney+=info.discountLostMoney;
        


              




          }
      });


      
      customerCash=customerCash.toFixed(2);
      supplierCosts=supplierCosts.toFixed(2);
      discountLostMoney=discountLostMoney.toFixed(2);
      tip=tip.toFixed(2);


      
      let lostInReturns = 0;

      if(returnCashData.length !=0){
        returnCashData.forEach(rcd =>{

        
        if(rcd.createdDate>=selectedRange[0] && rcd.createdDate<= selectedRange[1])
        lostInReturns = lostInReturns + Number(rcd.cashReturned);

      }
      )
      }


      let profit= Number(customerCash) - Number(supplierCosts)+Number(tip) - Number(lostInReturns);
      lostInReturns= lostInReturns.toFixed(2);
      profit=profit.toFixed(2);

      const averageOrderValue= (Number(profit) / Number(orderNumber)).toFixed(2);

      setCustomDateStats({orderNumber, customerCash, discountLostMoney, supplierCosts, tip, lostInReturns, averageOrderValue, profit})

console.log('cs', cashData);
     
    
       
    };


    const getAovChartData = ()=>{
      
      const AovChartData = [];
      

      cashData.forEach(item => {
        const indexOfCreatedDate = AovChartData.findIndex(data => {return data.createdDate == item.createdDate});
        if(indexOfCreatedDate == -1)
          AovChartData.push({createdDate:item.createdDate, profit: Number(item.cashObtained) - Number(item.supplierCosts)+Number(item.tip), orderNumber: 1})
        else {
          AovChartData[indexOfCreatedDate].profit += Number(item.cashObtained) - Number(item.supplierCosts)+Number(item.tip);
          AovChartData[indexOfCreatedDate].orderNumber += 1;
        }
      })

    

      return AovChartData.map(item => {return {createdDate:item.createdDate,yMetric: (item.profit/item.orderNumber).toFixed(2)}});

    }




    return <div className={styles.saleInfoDiv}>
    <h2 className={styles.saleInfoTitle}>Sale Information</h2>

<div className={styles.saleStats}>


    <div className={styles.saleStat}>
      <h2>Period</h2>
      <h2>TO</h2>
      <h2>SR</h2>
      <h2>LID</h2>
      <h2>Tips</h2>
      <h2>SC</h2>
      <h2>LIR</h2>
      <h2>AOV</h2>
      <h2>Profit</h2>
      </div>

      {StatField('Today')}
      {StatField('Last 7 days')}
      {StatField('Last 30 days')}
      {StatField('Last 365 days')}
      {StatField('All time')}
      
      <div className={styles.saleStat}>
    <div className={styles.datePickerWrapper}>



    <DatePicker range format="DD/MM/YYYY"  className={`bg-dark ${styles.datePicker}`}
    placeholder='Pick a date range'
    inputClass={styles.dateInput}
    onChange={(value) => {

            if(value.length>1){
              const dateRange = [ Math.floor(value[0].valueOf()/ 86400000),  Math.floor(value[1].valueOf()/ 86400000)];
          setSelectedRange(dateRange);
          customPeriodData(dateRange); //ovde
            }

        else {
          setSelectedRange([]);
          setCustomDateStats({orderNumber:'N/A', customerCash:'N/A', discountLostMoney:'N/A', supplierCosts:'N/A', tip:'N/A', lostInReturns: 'N/A', averageOrderValue: 'N/A', profit: 'N/A'});
      

        }
        
          }}/>
          
</div>


<span className={styles.statName}>{customDateStats.orderNumber}</span> 
        <span className={styles.statName}>{`${customDateStats.customerCash!="N/A" ? "$": ""}${customDateStats.customerCash}`}</span>
        <span className={styles.statName}>{`${customDateStats.discountLostMoney!="N/A" ? "$": ""}${customDateStats.discountLostMoney}`}</span>
        <span className={styles.statName}>{`${customDateStats.tip!="N/A" ? "$": ""}${customDateStats.tip}`}</span> 
        <span className={styles.statName}>{`${customDateStats.supplierCosts!="N/A" ? "$": ""}${customDateStats.supplierCosts}`}</span>
        <span className={styles.statName}>{`${customDateStats.lostInReturns!="N/A" ? "$": ""}${customDateStats.lostInReturns}`}</span>
        <span className={styles.statName}>{`${customDateStats.averageOrderValue!="N/A" ? "$": ""}${customDateStats.averageOrderValue}`}</span>
       
        <span className={styles.statName}>{`${customDateStats.profit!="N/A" ? "$": ""}${customDateStats.profit}`}</span> 

</div>
      
        

    

    </div>



    <div tabIndex={0} className={styles.onlyFulfilledOrdersDiv} onClick={()=>{setShouldUseOnlyFulfilledOrders(!shouldUseOnlyFulfilledOrders)}}>
               
<div  className={`${styles.onlyFulfilledOrdersChecker} 
${shouldUseOnlyFulfilledOrders && styles.onlyFulfilledOrdersChecked}`}
 
>
  <CorrectIcon styleClassName={styles.checkImage}/>
       
      </div>

      
 
  <span className={styles.onlyFulfilledOrdersText}>
  Show stats only for fulfilled orders
 </span>
      </div>

    <div className={styles.adminHomeControlsWrapper}>
          <button 
          onClick={()=>{setRevealStatsReadingInstructions(!revealStatsReadingInstructions)}}
          className={styles.revealInstructionsButton}>
            {revealStatsReadingInstructions?"Hide stats reading instructions":"Reveal stats reading instructions"}
            </button>

            <button 
            className={styles.revealInstructionsButton}
             onClick={()=>{setShowCharts(!showCharts)}}
             >
              {showCharts?"Hide charts":"Show charts"}
            </button>

            </div>


            {revealStatsReadingInstructions && <>
    <span className={styles.readStatsInstructionsSpan}>PERIOD - Period is specified time in which metrics are measured.</span>
    <span className={styles.readStatsInstructionsSpan}>TO - Total orders is the number of orders placed.</span>
    <span className={styles.readStatsInstructionsSpan}>SR - Sales revenue is the money obtained just from sales(product costs minus discounts, excluding tips).</span>
    <span className={styles.readStatsInstructionsSpan}>LID - Lost in discounts is money lost in discounts. Ps. Discounts let you get more customers, and more long-term value.</span>
    <span className={styles.readStatsInstructionsSpan}>TIPS - Tips is money generously donated by customers.</span>
    <span className={styles.readStatsInstructionsSpan}>SC - Supplier costs is the money spent on suppliers to purchase products to fulfill orders.</span>
    <span className={styles.readStatsInstructionsSpan}>LIR - Lost in returns is money lost in product returns. It affect profit metric, but it is not set to affect revenue,discounts, tips for now.</span>
    <span className={styles.readStatsInstructionsSpan}>AOV - Average order value is the average profit per order.</span>
    
    <span className={styles.readStatsInstructionsSpan}>PROFIT - Profit is the amount of money remaining after deducting Supplier costs from Revenue, and adding tips.</span>
    </>
}

{showCharts && <>

          <Charts title="Revenue" chartData={cashData.map(item => {return {createdDate:item.createdDate, yMetric:item.cashObtained}})}/>

          <Charts title="Profit" chartData={cashData.map(item => {return {createdDate:item.createdDate, yMetric:Number(item.cashObtained) - Number(item.supplierCosts)+Number(item.tip)}})}/>
          

          <Charts title="Average order number" chartData={getAovChartData() }/>
         


          </>
}
  

    </div>
}



