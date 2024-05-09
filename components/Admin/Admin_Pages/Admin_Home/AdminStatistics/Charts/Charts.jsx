import React, { useEffect, useState } from 'react'
import styles from './chart.module.css'
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {Chart, LinearScale, PointElement,LineElement , Tooltip, Legend, TimeScale, Filler} from "chart.js"; 




Chart.register(LinearScale, LineElement , PointElement, Tooltip, Legend, TimeScale, Filler); 





export default function Charts({title,chartData}) {




    console.log('Chart data', chartData);


    const [chartFinalData, setChartFinalData] = useState(null);








useEffect(()=>{


    //chart starts here

    const chartCalculatedData = [];

    const startDate = Math.floor(Math.min(
        chartData.map(data=> {return data.createdDate})
      
      )
      );

     
    const currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    for ( let i = startDate; i <= currentDate; i++){
 
      chartCalculatedData.push({date: i, yMetric: 0})
    }

    console.log('start data', chartCalculatedData)

    chartData.forEach(item=>{

     const foundItemIndex= chartCalculatedData.findIndex(chartItem=>{

      
      return chartItem.date==item.createdDate
    }
    );

    console.log('foundItemIndex', foundItemIndex);




     if(foundItemIndex != -1)chartCalculatedData[foundItemIndex].yMetric=chartCalculatedData[foundItemIndex].yMetric+item.yMetric;



     
  
     
    //  else    chartCalculatedData.push({date:item.createdDate, yMetric:item.yMetric});

     
    })

  

      const formatedChartData = chartCalculatedData.map(item => ({
        x: new Date(item.date * 24 * 60 * 60 * 1000),
        y: item.yMetric,
      }));
  
      // Sorting data based on the date


      formatedChartData.sort((a, b) => a.x - b.x);
  
      // Creating datasets for Chart.js
      const chartDatasets = [
        {
          label: title,
          data: formatedChartData,
          fill: "origin",
          backgroundColor: 'rgba(21, 23, 27, 0.507)',
          borderColor: 'rgba(63, 96, 79, 0.85)',
          responsive: true,
          tension: 0.1
        },
      ];

  
    
  
      setChartFinalData({
        datasets: chartDatasets,
      });


    //chart ends here
},[chartData])























    const chartOptions = {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day', // You can change the unit to 'week', 'month', or 'hour' as needed
            },
            bounds: 'data',
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
  
        
      };






  return (
    <div className={styles.lineStatsWrapper}>
    {chartFinalData && (
      <Line
        data={chartFinalData}
        options={chartOptions}
        width={600}
        height={400}
      />
    )}
  </div>
  )
}
