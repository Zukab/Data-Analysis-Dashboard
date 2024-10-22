import React from 'react';

interface DynamicTableProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, xAxis, yAxis }) => {
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

  const tableData = Object.entries(aggregatedData).sort((a, b) => b[1] - a[1]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">{xAxis}</th>
            <th className="py-3 px-6 text-left">{yAxis} (Sum)</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {tableData.map(([key, value], index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{key}</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">{value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;