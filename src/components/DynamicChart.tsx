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
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();

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
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: `${xAxis} vs ${yAxis} (Sum)`,
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
        }
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DynamicChart;