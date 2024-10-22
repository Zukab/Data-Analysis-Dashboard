import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import CSVUploader from './components/CSVUploader';
import Dashboard from './components/Dashboard';
import { sampleData, sampleHeaders } from './sampleData';

function App() {
  const [csvData, setCSVData] = useState<Array<Record<string, string>>>(sampleData);
  const [headers, setHeaders] = useState<string[]>(sampleHeaders);

  const handleCSVUpload = (data: Array<Record<string, string>>, headers: string[]) => {
    if (Array.isArray(headers)) {
      setCSVData(data);
      setHeaders(headers);
    } else {
      console.error('Headers is not an array:', headers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">CSV Data Analysis Dashboard</h1>
      </header>
      <main className="container mx-auto p-4">
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" /> Upload CSV File
          </h2>
          <CSVUploader onUpload={handleCSVUpload} />
        </section>
        
        <Dashboard data={csvData} headers={headers} />
      </main>
    </div>
  );
}

export default App;