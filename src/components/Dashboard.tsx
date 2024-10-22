import React, { useState } from 'react';
import DynamicTable from './DynamicTable';
import DynamicChart from './DynamicChart';

interface DashboardProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, headers }) => {
  const [xAxis, setXAxis] = useState(headers[0]);
  const [yAxis, setYAxis] = useState(headers[1]);

  if (!Array.isArray(headers)) {
    return <div>Error: headers no es un array.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Data Analysis Dashboard</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select X-Axis:</label>
        <select
          value={xAxis}
          onChange={(e) => setXAxis(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Y-Axis:</label>
        <select
          value={yAxis}
          onChange={(e) => setYAxis(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {headers.map((header) => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Dynamic Table</h3>
          <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Dynamic Chart</h3>
          <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;