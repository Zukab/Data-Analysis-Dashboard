import { useState } from 'react';
import { Upload, BarChart2, FileSpreadsheet, Database, Menu, X } from 'lucide-react';
import dataLogo from './assets/images/data.png';
import CSVUploader from './components/CSVUploader';
import Dashboard from './components/Dashboard';
import { sampleData, sampleHeaders } from './constants/sampleData';

function App() {
  const [csvData, setCSVData] = useState<Array<Record<string, string>>>(sampleData);
  const [headers, setHeaders] = useState<string[]>(sampleHeaders);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <header className="bg-white text-gray-800 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50/30"></div>
        <div className="max-w-7xl mx-auto relative">
          {/* Barra superior con enlaces */}
          <div className="border-b border-gray-200">
            <div className="flex justify-end items-center py-2 px-4 text-sm">
              <div className="hidden md:flex items-center">
                <a 
                  href="https://www.linkedin.com/in/juan-sebastian-quintero-fernandez-35b514255/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 transition-colors px-3 py-1 flex items-center gap-1"
                >
                  <span>Linkedin</span>
                </a>
                <a 
                  href="https://github.com/Zukab/Data-Analysis-Dashboard" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 transition-colors px-3 py-1 flex items-center gap-1"
                >
                  <span>GitHub</span>
                </a>
              </div>
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 z-50">
              <div className="flex flex-col p-4">
                <a 
                  href="https://www.linkedin.com/in/juan-sebastian-quintero-fernandez-35b514255/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 py-2"
                >
                  Linkedin
                </a>
                <a 
                  href="https://github.com/Zukab/Data-Analysis-Dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 py-2"
                >
                  GitHub
                </a>
              </div>
            </div>
          )}
          
          {/* Contenido principal del header */}
          <div className="px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Logo y título */}
              <div className="flex items-center gap-4 md:gap-6">
                <img 
                  src={dataLogo} 
                  alt="Data Analysis Logo"
                  className="w-20 h-20 md:w-24 md:h-24 object-contain bg-white rounded-3xl p-3 shadow-lg"
                  style={{
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                  }}
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Data Analysis
                  </h1>
                  <p className="text-gray-600 text-sm">Data Visualization</p>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 md:flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-3 bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200">
                  <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  <div>
                    <div className="text-sm text-gray-500">Columnas</div>
                    <div className="font-semibold text-gray-900">{headers.length}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200">
                  <Database className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  <div>
                    <div className="text-sm text-gray-500">Registros</div>
                    <div className="font-semibold text-gray-900">{csvData.length}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200">
                  <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  <div>
                    <div className="text-sm text-gray-500">Gráficos</div>
                    <div className="font-semibold text-gray-900">4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" /> Upload CSV File
          </h2>
          <CSVUploader
            setCSVData={setCSVData}
            setHeaders={setHeaders}
            onUpload={handleCSVUpload} 
          />
        </section>

        <Dashboard data={csvData} headers={headers} />
      </main>
    </div>
  );
}

export default App;