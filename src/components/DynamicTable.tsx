import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DynamicTableProps {
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

interface TableData {
  key: string;
  sum: number;
  avg: number;
  min: number;
  max: number;
  count: number;
  median: number;
  mode: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, xAxis, yAxis }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableData | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const tableData = useMemo(() => {
    const groupedData: Record<string, number[]> = {};
    
    // Agrupar datos
    data.forEach((row) => {
      const key = row[xAxis];
      const value = parseFloat(row[yAxis]);
      if (!isNaN(value)) {
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(value);
      }
    });

    // Calcular estadísticas
    const processedData: TableData[] = Object.entries(groupedData).map(([key, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const mode = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        key,
        sum: values.reduce((a, b) => a + b, 0),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
        median: sorted.length % 2 === 0 
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid],
        mode: Object.entries(mode)
          .sort(([,a], [,b]) => b - a)[0][0]
      };
    });

    // Ordenar datos si hay configuración de ordenamiento
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, xAxis, yAxis, sortConfig]);

  const handleSort = (key: keyof TableData) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    });
  };

  const displayedData = showAll ? tableData : tableData.slice(0, 7);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {Object.keys(tableData[0] || {}).map((header) => (
                    <th
                      key={header}
                      onClick={() => handleSort(header as keyof TableData)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {header}
                      {sortConfig.key === header && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
                {displayedData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.sum.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.avg.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.min.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.max.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.median.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{row.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {showAll ? 'Show Less' : `Show All (${tableData.length} rows)`}
        </button>
        {!showAll && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedData.length} of {tableData.length} rows
          </span>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;