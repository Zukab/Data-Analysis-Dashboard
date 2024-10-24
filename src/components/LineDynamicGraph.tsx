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
  PointElement, // Asegúrate de importar PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement // Registra PointElement
);

interface LineDynamicGraphProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const LineDynamicGraph: React.FC<LineDynamicGraphProps> = ({ data, xAxis, yAxis }) => {
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
        label: `${yAxis} (Line)`,
        data: Object.values(aggregatedData).map(values => values.reduce((a, b) => a + b, 0)),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
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
        text: `${xAxis} vs ${yAxis} (Line)`,
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

export default LineDynamicGraph;