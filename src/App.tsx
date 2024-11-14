import { useState } from 'react';
import { Upload, BarChart2, FileSpreadsheet, Database, Menu, X, Github, Sun, Moon } from 'lucide-react';
import dataLogo from './assets/images/data.png';
import CSVUploader from './components/CSVUploader';
import Dashboard from './components/Dashboard';
import { sampleData, sampleHeaders } from './constants/sampleData';
import { useTheme } from './context/ThemeContext';

function App() {
  const [csvData, setCSVData] = useState<Array<Record<string, string>>>(sampleData);
  const [headers, setHeaders] = useState<string[]>(sampleHeaders);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleCSVUpload = (data: Array<Record<string, string>>, headers: string[]) => {
    if (Array.isArray(headers)) {
      setCSVData(data);
      setHeaders(headers);
    } else {
      console.error('Headers is not an array:', headers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#292929]">
      <header className="bg-white dark:bg-[#1e1e1e] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 md:px-6 py-4">
            {/* Título y descripción con animación */}
            <div className="relative group">
              <a 
                href="https://github.com/Zukab/Data-Analysis-Dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-6 py-4 bg-white dark:bg-[#1e1e1e] rounded-lg block"
              >
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-300">
                    Data Analysis
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Interactive data visualization dashboard
                  </p>
                  <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
                </div>
              </a>
            </div>

            {/* Stats y Links */}
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden md:flex divide-x divide-gray-200 dark:divide-gray-700">
                <div className="px-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Columns</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{headers.length}</p>
                </div>
                <div className="px-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Records</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{csvData.length}</p>
                </div>
              </div>

              {/* Links */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <a 
                  href="https://github.com/Zukab/Data-Analysis-Dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Menú móvil */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menú móvil expandido */}
          {isMenuOpen && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 md:hidden">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Columns</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{headers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Records</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{csvData.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md p-6 mb-6">
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