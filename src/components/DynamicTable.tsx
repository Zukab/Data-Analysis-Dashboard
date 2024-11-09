import React, { useState } from 'react';

interface DynamicTableProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, xAxis, yAxis }) => {
  const [showAll, setShowAll] = useState(false);
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

  const calculateStatistics = (values: number[]) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const count = values.length;

    const sortedValues = [...values].sort((a, b) => a - b);
    const median =
      sortedValues.length % 2 === 0
        ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
        : sortedValues[Math.floor(sortedValues.length / 2)];

    const mode = values.sort((a, b) =>
      values.filter(v => v === a).length - values.filter(v => v === b).length
    ).pop();

    return { sum, avg, min, max, count, median, mode };
  };

  const tableData = Object.entries(aggregatedData).map(([key, values]) => {
    const stats = calculateStatistics(values);
    return { key, ...stats };
  }).sort((a, b) => b.sum - a.sum);

  // Limitar las filas mostradas
  const displayedData = showAll ? tableData : tableData.slice(0, 7);

  return (
    <div className="flex flex-col h-full">
      <div className="table-container flex-1">
        <table className="min-w-full bg-white table-fixed">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left w-1/8">{xAxis}</th>
              <th className="py-3 px-6 text-left w-1/8">Sum</th>
              <th className="py-3 px-6 text-left w-1/8">Avg</th>
              <th className="py-3 px-6 text-left w-1/8">Min</th>
              <th className="py-3 px-6 text-left w-1/8">Max</th>
              <th className="py-3 px-6 text-left w-1/8">Count</th>
              <th className="py-3 px-6 text-left w-1/8">Median</th>
              <th className="py-3 px-6 text-left w-1/8">Mode</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {displayedData.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.key}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.sum.toFixed(2)}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.avg.toFixed(2)}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.min.toFixed(2)}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.max.toFixed(2)}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.count}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.median.toFixed(2)}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{row.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {showAll ? 'Show Less' : 'Show All Rows'}
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;