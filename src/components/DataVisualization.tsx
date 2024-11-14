import React, { useState } from 'react';
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

interface DataVisualizationProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, headers }) => {
  const { theme } = useTheme();
  const [selectedColumn, setSelectedColumn] = useState(headers[0]);

  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColumn(event.target.value);
  };

  const chartData = {
    labels: data.map((row) => row[headers[0]]),
    datasets: [
      {
        label: selectedColumn,
        data: data.map((row) => parseFloat(row[selectedColumn]) || 0),
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
        text: `${selectedColumn} Visualization`,
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
      },
    },
    scales: {
      y: {
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

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="column-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Select column to visualize:
        </label>
        <select
          id="column-select"
          value={selectedColumn}
          onChange={handleColumnChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DataVisualization;