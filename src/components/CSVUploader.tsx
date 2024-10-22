import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface CSVUploaderProps {
  onUpload: (data: Array<Record<string, string>>, headers: string[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null); // Reiniciar el mensaje de éxito
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          complete: (result) => {
            if (result.errors.length > 0) {
              console.error('CSV parsing errors:', result.errors);
              setError('Error parsing CSV file. Please check the console for details.');
              setIsLoading(false);
              return;
            } else {
              const headers = Object.keys(result.data[0]);
              const data = result.data as Array<Record<string, string>>;
              if (Array.isArray(headers) && headers.length > 0) {
                onUpload(data, headers);
                setSuccessMessage('El archivo se ha procesado correctamente.'); // Mensaje de éxito
              } else {
                setError('Parsed headers are not an array or are empty.');
              }
            }
            setIsLoading(false); // Asegúrate de detener la carga aquí
          },
          header: true,
          skipEmptyLines: true,
          delimiter: ',',
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError('Error parsing CSV file. Please check the console for details.');
            setIsLoading(false);
          },
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as Array<Array<string>>;

            if (Array.isArray(headers) && headers.length > 0) {
              const formattedData = rows.map((row) => {
                const obj: Record<string, string> = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index]?.toString() || '';
                });
                return obj;
              });
              onUpload(formattedData, headers);
              setSuccessMessage('El archivo se ha procesado correctamente.'); // Mensaje de éxito
            } else {
              setError('Parsed headers are not an array or are empty.');
            }
          } catch (error) {
            console.error('Excel parsing error:', error);
            setError('Error parsing Excel file. Please check the console for details.');
          } finally {
            setIsLoading(false); // Detener la carga aquí también
          }
        };
        reader.onerror = () => {
          console.error('FileReader error:', reader.error);
          setError('Error reading file. Please try again.');
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError('Unsupported file format. Please upload a CSV or Excel file.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV or Excel file (MAX. 10MB)</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Processing file...</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-center text-green-500">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVUploader;