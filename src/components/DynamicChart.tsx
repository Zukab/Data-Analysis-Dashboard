import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DynamicChartProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ data, xAxis, yAxis }) => {
  const aggregatedData: Record<string, number> = {};

  data.forEach((row) => {
    const xValue = row[xAxis];
    const yValue = parseFloat(row[yAxis]);
    if (!isNaN(yValue)) {
      if (aggregatedData[xValue]) {
        aggregatedData[xValue] += yValue;
      } else {
        aggregatedData[xValue] = yValue;
      }
    }
  });

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: `${yAxis} (Sum)`,
        data: Object.values(aggregatedData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${xAxis} vs ${yAxis} (Sum)`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DynamicChart;