import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createSwapy } from 'swapy';
import DynamicTable from './DynamicTable';
import DynamicChart from './DynamicChart';
import LineDynamicGraph from './LineDynamicGraph';
import StackedDynamicAreaChart from './StackedDynamicAreaChart';
import { GripVertical } from 'lucide-react';
import Modal from './Modal';

interface DashboardProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, headers }) => {
  const [xAxis, setXAxis] = useState(headers[0]);
  const [yAxis, setYAxis] = useState(headers[1]);
  const [widgets, setWidgets] = useState<{ id: string; type: string; title: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<any>(null);
  const [modalContent, setModalContent] = useState<{ isOpen: boolean; type: string; title: string } | null>(null);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    if (containerRef.current && widgets.length > 0) {
      if (swapyRef.current) {
        swapyRef.current.enable(false);
        swapyRef.current = null;
      }
      
      const swapyInstance = createSwapy(containerRef.current, {
        animation: 'none',
        handle: '[data-swapy-handle]',
        dragThreshold: 5,
        debounce: 10,
        resistance: 0
      });

      let timeoutId: NodeJS.Timeout;
      swapyInstance.onSwap((event: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const newOrder = event.data.array
            .map((item: { item: string }) => widgets.find(w => w.id === item.item))
            .filter(Boolean);
          
          if (newOrder.length === widgets.length) {
            setWidgets(newOrder);
          }
        }, 50);
      });

      swapyRef.current = swapyInstance;

      return () => {
        clearTimeout(timeoutId);
        if (swapyRef.current) {
          swapyRef.current.enable(false);
          swapyRef.current = null;
        }
      };
    }
  }, [widgets.length]);

  const addWidget = (type: string) => {
    if (!type) return;
    const newId = `widget-${Date.now()}`;
    const newWidget = { id: newId, type, title: type.charAt(0).toUpperCase() + type.slice(1) };
    setWidgets([...widgets, newWidget]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Data Analysis Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X Axis
          </label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y Axis
          </label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {headers.map((header) => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Widget
          </label>
          <select
            onChange={(e) => addWidget(e.target.value)}
            value=""
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select type...</option>
            <option value="table">Table</option>
            <option value="chart">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="stackedArea">Stacked Area</option>
          </select>
        </div>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            data-swapy-slot={`slot-${index}`}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              data-swapy-item={widget.id}
              className="w-full h-full flex flex-col"
            >
              <div className="p-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div data-swapy-handle className="touch-none cursor-move">
                    <GripVertical className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-700">{widget.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalContent({ isOpen: true, type: widget.type, title: widget.title })}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                  >
                    Expand
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => {
                      const newWidgets = widgets.filter(w => w.id !== widget.id);
                      setWidgets(newWidgets);
                    }}
                    className="text-gray-600 hover:text-red-600 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="p-4 h-[300px] overflow-auto widget-content">
                {widget.type === 'table' && (
                  <div className="table-wrapper">
                    <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />
                  </div>
                )}
                {widget.type === 'chart' && <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />}
                {widget.type === 'line' && <LineDynamicGraph data={data} xAxis={xAxis} yAxis={yAxis} />}
                {widget.type === 'stackedArea' && <StackedDynamicAreaChart data={data} xAxis={xAxis} yAxis={yAxis} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalContent && (
        <Modal
          isOpen={modalContent.isOpen}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
        >
          <div className="h-full">
            {modalContent.type === 'table' && (
              <div className="h-full overflow-auto">
                <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />
              </div>
            )}
            {modalContent.type === 'chart' && <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />}
            {modalContent.type === 'line' && <LineDynamicGraph data={data} xAxis={xAxis} yAxis={yAxis} />}
            {modalContent.type === 'stackedArea' && <StackedDynamicAreaChart data={data} xAxis={xAxis} yAxis={yAxis} />}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;