import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload } from 'lucide-react';

interface CSVUploaderProps {
  onUpload: (data: Array<Record<string, string>>, headers: string[]) => void;
  setCSVData: (data: Array<Record<string, string>>) => void;
  setHeaders: (headers: string[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload, setCSVData, setHeaders }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setUploadedFileName(file.name);

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse<Record<string, string>>(file, {
          complete: (result) => {
            if (result.errors.length > 0) {
              console.error('CSV parsing errors:', result.errors);
              setError('Error parsing CSV file. Please check the console for details.');
              setIsLoading(false);
              return;
            } else {
              const data = result.data as Array<Record<string, string>>;
              const headers = Object.keys(result.data[0]);

              if (Array.isArray(headers) && headers.length > 0) {
                onUpload(data, headers);
                toast.success('El archivo se ha procesado correctamente');
              } else {
                setError('Parsed headers are not an array or are empty.');
              }
            }
            setIsLoading(false);
          },
          header: true,
          skipEmptyLines: true,
          delimiter: ',',
          error: (error: Error) => {
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
              toast.success('El archivo se ha procesado correctamente');
            } else {
              setError('Parsed headers are not an array or are empty.');
            }
          } catch (error) {
            console.error('Excel parsing error:', error);
            setError('Error parsing Excel file. Please check the console for details.');
          } finally {
            setIsLoading(false);
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'] },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setCSVData([]);
    setHeaders([]);
    toast.info('Archivo eliminado');
  };

  return (
    <div className="w-full">
      {!uploadedFileName ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-[#1e1e1e] border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] ${
            isDragActive ? 'border-blue-500 dark:border-blue-400' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload 
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
            {isDragActive ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Suelta el archivo aquí...</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV or Excel file (MAX. 10MB)</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              className="w-12 h-12 text-green-500 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2l4 -4"
              ></path>
            </svg>
            <p className="text-sm text-gray-500">{uploadedFileName}</p>
            <p className="text-xs text-gray-500">Archivo subido con éxito</p>
          </div>
          <button
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleRemoveFile}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Procesando archivo...</p>
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
