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
  Filler, // Importa Filler para el área apilada
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Filler // Registra Filler
);

interface StackedDynamicAreaChartProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const StackedDynamicAreaChart: React.FC<StackedDynamicAreaChartProps> = ({ data, xAxis, yAxis }) => {
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
        fill: true, // Habilita el llenado del área
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4, // Suaviza la línea
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
        text: `${xAxis} vs ${yAxis} (Stacked Area)`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default StackedDynamicAreaChart;
