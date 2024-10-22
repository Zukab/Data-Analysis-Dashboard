import React from 'react';

interface StatisticsProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const Statistics: React.FC<StatisticsProps> = ({ data, headers }) => {
  const calculateStatistics = (column: string) => {
    const numericData = data
      .map((row) => parseFloat(row[column]))
      .filter((value) => !isNaN(value));

    if (numericData.length === 0) {
      return { mean: 'N/A', median: 'N/A', stdDev: 'N/A' };
    }

    const sum = numericData.reduce((acc, val) => acc + val, 0);
    const mean = sum / numericData.length;

    const sortedData = [...numericData].sort((a, b) => a - b);
    const median =
      sortedData.length % 2 === 0
        ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
        : sortedData[Math.floor(sortedData.length / 2)];

    const squaredDifferences = numericData.map((value) => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / numericData.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {headers.map((header) => {
        const stats = calculateStatistics(header);
        return (
          <div key={header} className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{header}</h3>
            <p>Mean: {stats.mean}</p>
            <p>Median: {stats.median}</p>
            <p>Standard Deviation: {stats.stdDev}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;