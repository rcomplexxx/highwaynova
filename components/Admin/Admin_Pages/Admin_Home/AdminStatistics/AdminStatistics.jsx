import { useEffect, useState } from 'react';
import styles from './adminstatistics.module.css'
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import coupons from "@/data/coupons.json"

import { CorrectIcon } from '@/public/images/svgs/svgImages';
import InstructionsWrapper from '../InstructionsWrapper/InstructionsWrapper';
import Charts from './Charts/Charts.jsx';


export default function AdminStatistics(){
  
    const [financeData, setFinanceData] = useState([]);
    const [refundData, setRefundData] = useState([]);
    
    const [customDateRange, setCustomDateRange] = useState([]);
    
    const [includeOnlyFulfilledOrders, setIncludeOnlyFulfilledOrders]= useState(false);
  
   



    // dataType={}
    useEffect(() => {
      const dayInMs = 86400000;
    
      const fetchData = async () => {
        try {





          
          const fetchApi = async (dataType) => {
            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ dataType }),
            });
            return response.ok ? response.json() : Promise.reject("Network response not ok.");
          };
      
          const { data: returnFinances } = await fetchApi("get_product_returns");
          const refundData = returnFinances?.map(({ returnCost, createdDate }) => ({
            returnCost,
            createdDate: Math.floor(createdDate / dayInMs),
          })) || [];
      
          setRefundData(refundData);
          console.log("refund data", refundData);
      
          const financeDataType = includeOnlyFulfilledOrders
            ? "get_finance_data_only_fulfilled_orders"
            : "get_finance_data";
          const financeDataResponse = await fetchApi(financeDataType);
    
          const financeData = financeDataResponse.data.map(({ total, tip = 0, supplyCost, createdDate, couponCode }) => {
            const discountPercentage = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())?.discountPercentage || 0;
            const discountLostMoney = Number(((total - tip) * discountPercentage / (100 - discountPercentage)).toFixed(2));
          
            return {
              createdDate: Math.floor(createdDate / dayInMs),
              total: Number(total.toFixed(2)),
              discountLostMoney,
              supplyCost,
              tip: +tip,
            };
          });
    
          setFinanceData(financeData);
          console.log("cash info", financeData);








        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
    
      fetchData();
    }, [includeOnlyFulfilledOrders]);





    const StatField = (period, startPeriod, endPeriod) => {


      
      const dayInMs = 86400000;
      const unixTimestampInDays = Math.floor(Date.now() / dayInMs);
   
    
      if (period === 'Custom date' && !endPeriod) {
        return (
          <div className={styles.saleStat}>
            <div className={styles.datePickerWrapper}>
            <DatePicker
              range
              format="DD/MM/YYYY"
              className={`bg-dark ${styles.datePicker}`}
              placeholder="Pick a date range"
              inputClass={styles.dateInput}
              onChange={(value) => {
                if (value.length > 1) {
                  setCustomDateRange([
                    Math.floor(value[0].valueOf() / dayInMs),
                    Math.floor(value[1].valueOf() / dayInMs),
                  ]);
                }
              }}
            />
            </div>
            {Array(8).fill(<span>N/A</span>)}
            
          </div>
        );
      }



      endPeriod = endPeriod || unixTimestampInDays;
    
      // Default period range calculation
      const periodMap = {
        Today: 0,
        'Last 7 days': 7,
        'Last 30 days': 30,
        'Last 365 days': 365,
        'All time': endPeriod,
      };
      startPeriod = startPeriod || (endPeriod - (periodMap[period] ?? endPeriod));
    
   

      const stats = financeData?.reduce((acc, { createdDate, total, discountLostMoney, supplyCost, tip }) => {
        if (createdDate >= startPeriod && createdDate <= endPeriod) {
          acc.orderNumber++;
          acc.total += total;
          acc.discountLostMoney += discountLostMoney;
          acc.supplyCost += supplyCost;
          acc.tip += tip;
        }
        return acc;
      }, { orderNumber: 0, total: 0, discountLostMoney: 0, supplyCost: 0, tip: 0, refund: 0 });
      
    
      stats.refund = refundData?.reduce((acc, { createdDate, returnCost }) => {
        return createdDate >= startPeriod && createdDate <= endPeriod ? acc + returnCost : acc;
      }, 0);
    
      // Format numbers
      const formatNum = (num) => num.toFixed(2);
      Object.keys(stats).forEach((key) => {
        if (key !== 'orderNumber') {
          stats[key] = formatNum(stats[key]);
        }
      });

      
      const profit = formatNum(Number(stats.total) - Number(stats.supplyCost) + Number(stats.tip) - Number(stats.refund));
      const averageOrderValue = formatNum(stats.orderNumber ? Number(profit) / Number(stats.orderNumber) : 0);

   
      

    
    
      return (
        <div className={styles.saleStat}>
          {period !== 'Custom date' ? (
            <span>{period}</span>
          ) : (
            <div className={styles.datePickerWrapper}>
            <DatePicker
              range
              format="DD/MM/YYYY"
              className={`bg-dark ${styles.datePicker}`}
              placeholder="Pick a date range"
              inputClass={styles.dateInput}
              onChange={(value) => {
                if (value.length > 1) {
                  setCustomDateRange([
                    Math.floor(value[0].valueOf() / dayInMs),
                    Math.floor(value[1].valueOf() / dayInMs),
                  ]);
                }
              }}
            />
            </div>
          )}
          <span>{stats.orderNumber}</span>
          <span>${stats.total}</span>
          <span>${stats.discountLostMoney}</span>
          <span>${stats.tip}</span>
          <span>${stats.supplyCost}</span>
          <span>${stats.refund}</span>
          <span>${averageOrderValue}</span>
          <span>${profit}</span>
        </div>
      );
    };







    




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
      <h2>RFND</h2>
      <h2>AOV</h2>
      <h2>Profit</h2>
      </div>

      {StatField('Today')}
      {StatField('Last 7 days')}
      {StatField('Last 30 days')}
      {StatField('Last 365 days')}
      {StatField('All time')}
      {StatField('Custom date',customDateRange[0], customDateRange[1])}
       

          


        

    

    </div>



    <div tabIndex={0} className={styles.onlyFulfilledOrdersDiv} onClick={()=>{setIncludeOnlyFulfilledOrders(!includeOnlyFulfilledOrders)}}>
               
<div  className={`${styles.onlyFulfilledOrdersChecker} 
${includeOnlyFulfilledOrders && styles.onlyFulfilledOrdersChecked}`}
 
>
  <CorrectIcon styleClassName={styles.checkImage}/>
       
      </div>

      
 
  <span className={styles.onlyFulfilledOrdersText}>
  Include only fulfilled orders
 </span>
      </div>

    <div className={styles.adminHomeControlsWrapper}>


        <InstructionsWrapper>
        <span>PERIOD - Period is specified time in which metrics are measured.</span>
    <span>TO - Total orders is the number of orders placed.</span>
    <span>SR - Sales revenue is the money obtained just from sales(product costs minus discounts, excluding tips).</span>
    <span>LID - Lost in discounts is money lost in discounts. Ps. Discounts let you get more customers, and more long-term value.</span>
    <span>TIPS - Tips is money generously donated by customers.</span>
    <span>SC - Supplier costs is the money spent on suppliers to purchase products to fulfill orders.</span>
    <span>RFND - Refund is money lost in product returns. It affect profit metric, but it is not set to affect revenue,discounts, tips for now.</span>
    <span>AOV - Average order value is the average profit per order.</span>
    
    <span>PROFIT - Profit is the amount of money remaining after deducting Supplier costs from Revenue, and adding tips.</span>
    </InstructionsWrapper>


    </div>
        <Charts financeData={financeData}/>
  

    </div>
}



