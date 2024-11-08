import React, { useState, useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';
import DynamicTable from './DynamicTable';
import DynamicChart from './DynamicChart';
import LineDynamicGraph from './LineDynamicGraph';
import StackedDynamicAreaChart from './StackedDynamicAreaChart';
import { GripVertical } from 'lucide-react';

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

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && widgets.length > 0) {
      if (swapyRef.current) {
        swapyRef.current.enable(false);
        swapyRef.current = null;
      }
      
      const swapyInstance = createSwapy(containerRef.current, {
        animation: 'spring'
      });

      swapyInstance.onSwap((event: any) => {
        const newOrder = event.data.array
          .map((item: { item: string }) => widgets.find(w => w.id === item.item))
          .filter(Boolean);
        
        if (newOrder.length === widgets.length) {
          setWidgets(newOrder);
        }
      });

      swapyRef.current = swapyInstance;

      return () => {
        if (swapyRef.current) {
          swapyRef.current.enable(false);
          swapyRef.current = null;
        }
      };
    }
  }, [widgets.length]);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

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
              <option key={header} value={header}>
                {header}
              </option>
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
              <option key={header} value={header}>
                {header}
              </option>
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

      <div ref={containerRef} className="space-y-4">
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            data-swapy-slot={`slot-${index}`}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              data-swapy-item={widget.id}
              className="w-full"
            >
              <div className="p-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div data-swapy-handle>
                    <GripVertical className="text-gray-400 cursor-move" />
                  </div>
                  <h3 className="font-medium text-gray-700">{widget.title}</h3>
                </div>
                <button
                  onClick={() => {
                    const newWidgets = widgets.filter(w => w.id !== widget.id);
                    setWidgets(newWidgets);
                  }}
                  className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="p-4">
                {widget.type === 'table' && <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />}
                {widget.type === 'chart' && <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />}
                {widget.type === 'line' && <LineDynamicGraph data={data} xAxis={xAxis} yAxis={yAxis} />}
                {widget.type === 'stackedArea' && <StackedDynamicAreaChart data={data} xAxis={xAxis} yAxis={yAxis} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;