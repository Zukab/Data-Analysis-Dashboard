import React, { useState } from 'react';

interface DataTableProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const DataTable: React.FC<DataTableProps> = ({ data, headers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-[#1e1e1e]">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-6 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="py-3 px-6 text-left whitespace-nowrap">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTable;