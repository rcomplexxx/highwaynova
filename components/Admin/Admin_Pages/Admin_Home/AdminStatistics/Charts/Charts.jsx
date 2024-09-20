import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import { Chart, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import styles from './chart.module.css';

Chart.register(LinearScale, LineElement, PointElement, Tooltip, Legend, TimeScale, Filler);

export default function Charts({ title, chartData }) {
  const [chartFinalData, setChartFinalData] = useState(null);

  useEffect(() => {
    if (!chartData.length) return;

    const startDate = Math.min(...chartData.map(({ createdDate }) => createdDate));
    const currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    // Create a map to track yMetrics
    const dateMap = chartData.reduce((acc, { createdDate, yMetric }) => {
      acc[createdDate] = (acc[createdDate] || 0) + yMetric;
      return acc;
    }, {});

    // Generate date array and fill in missing dates with 0
    const formatedChartData = Array.from(
      { length: currentDate - startDate + 1 },
      (_, i) => ({
        x: new Date((startDate + i) * 24 * 60 * 60 * 1000),
        y: dateMap[startDate + i] || 0,
      })
    ).filter(({ y }) => y > 0); // Only include dates where yMetric is greater than 0

    setChartFinalData({
      datasets: [
        {
          label: title,
          data: formatedChartData,
          fill: 'origin',
          backgroundColor: 'rgba(21, 23, 27, 0.507)',
          borderColor: 'rgba(63, 96, 79, 0.85)',
          tension: 0.1,
          pointHoverBorderWidth: 2,
          pointHitRadius: 40,
        },
      ],
    });
  }, [chartData, title]);

  const chartOptions = {
    scales: {
      x: { type: 'time', time: { unit: 'day' }, bounds: 'data' },
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: true, position: 'top' },
      zoom: { zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' } },
    },
  };

  return (
    <div className={styles.lineStatsWrapper}>
      {chartFinalData && <Line data={chartFinalData} options={chartOptions} width={600} height={400} />}
    </div>
  );
}