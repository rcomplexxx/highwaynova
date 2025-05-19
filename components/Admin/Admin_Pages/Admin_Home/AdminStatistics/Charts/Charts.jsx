


import  AdminChart  from './AdminChart/AdminChart';
import { useState } from "react";
import styles from './charts.module.css'





export default function Charts({financeData}) {


    
        const [showCharts, setShowCharts] = useState(true);


        const getAovChartData = () => {
              const AovChartData = financeData?.reduce((acc, { createdDate, total, supplyCost, tip }) => {
                const index = acc.findIndex(data => data.createdDate === createdDate);
                const profit = Number(total) - Number(supplyCost) + Number(tip);
            
                if (index === -1) {
                  acc.push({ createdDate, profit, orderNumber: 1 });
                } else {
                  acc[index].profit += profit;
                  acc[index].orderNumber += 1;
                }
                return acc;
              }, []);
            
              return AovChartData.map(({ createdDate, profit, orderNumber }) => ({
                createdDate,
                yMetric: (profit / orderNumber).toFixed(2)
              }));
            };



  return  <>
    <button 
    className={styles.showChartsButton}
     onClick={()=>{setShowCharts(!showCharts)}}
     >
      {showCharts?"Hide charts":"Show charts"}
    </button>

   


  
  


{showCharts && <div className={styles.chartsWrapper}>
 <AdminChart title="Revenue" chartData={financeData.map(item => {return {createdDate:item.createdDate, yMetric:item.total}})}/>
 <AdminChart title="Profit" chartData={financeData.map(item => {return {createdDate:item.createdDate, yMetric:Number(item.total) - Number(item.supplyCost)+Number(item.tip)}})}/>
 <AdminChart title="Average order value" chartData={getAovChartData() }/>
 
  </div>
}

</>
  
}
