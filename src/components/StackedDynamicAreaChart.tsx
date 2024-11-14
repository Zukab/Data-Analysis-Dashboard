import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Filler
);

interface StackedDynamicAreaChartProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const StackedDynamicAreaChart: React.FC<StackedDynamicAreaChartProps> = ({ data, xAxis, yAxis }) => {
  const { theme } = useTheme();

  const aggregatedData: Record<string, number[]> = {};

  data.forEach((row) => {
    const xValue = row[xAxis];
    const yValue = parseFloat(row[yAxis]);
    if (!isNaN(yValue)) {
      if (!aggregatedData[xValue]) {
        aggregatedData[xValue] = [];
      }
      aggregatedData[xValue].push(yValue);
    }
  });

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: `${yAxis} (Stacked Area)`,
        data: Object.values(aggregatedData).map(values => values.reduce((a, b) => a + b, 0)),
        fill: true,
        backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.3)' : 'rgba(75, 192, 192, 0.6)',
        borderColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.8)' : 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
          font: {
            family: "'Cabinet Grotesk', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: `${xAxis} vs ${yAxis} (Stacked Area)`,
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        font: {
          family: "'Cabinet Grotesk', sans-serif",
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
          font: {
            family: "'Cabinet Grotesk', sans-serif"
          }
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
          font: {
            family: "'Cabinet Grotesk', sans-serif"
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default StackedDynamicAreaChart;
