import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DynamicTable from './DynamicTable';
import DynamicChart from './DynamicChart';
import LineDynamicGraph from './LineDynamicGraph';
import StackedDynamicAreaChart from './StackedDynamicAreaChart';
import { GripVertical } from 'lucide-react';
import Modal from './Modal';

interface SortableWidgetProps {
  widget: {
    id: string;
    type: string;
    title: string;
  };
  onExpand: (widget: any) => void;
  onRemove: (id: string) => void;
  data: Array<Record<string, string>>;
  xAxis: string;
  yAxis: string;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ widget, onExpand, onRemove, data, xAxis, yAxis }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div 
            {...attributes}
            {...listeners}
            className="cursor-move p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <GripVertical className="text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {widget.title}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onExpand(widget)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
          >
            Expand
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button 
            onClick={() => onRemove(widget.id)}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="p-4 h-[300px] overflow-auto widget-content">
        {widget.type === 'table' && <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />}
        {widget.type === 'chart' && <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />}
        {widget.type === 'line' && <LineDynamicGraph data={data} xAxis={xAxis} yAxis={yAxis} />}
        {widget.type === 'stackedArea' && <StackedDynamicAreaChart data={data} xAxis={xAxis} yAxis={yAxis} />}
      </div>
    </div>
  );
};

interface DashboardProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, headers }) => {
  const [xAxis, setXAxis] = useState(headers[0]);
  const [yAxis, setYAxis] = useState(headers[1]);
  const [widgets, setWidgets] = useState<{ id: string; type: string; title: string }[]>([]);
  const [modalContent, setModalContent] = useState<{ isOpen: boolean; type: string; title: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            X Axis
          </label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {headers.map((header) => (
              <option key={header} value={header} className="text-gray-900 dark:text-gray-200">
                {header}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Y Axis
          </label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {headers.map((header) => (
              <option key={header} value={header} className="text-gray-900 dark:text-gray-200">
                {header}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Add Widget
          </label>
          <select
            onChange={(e) => addWidget(e.target.value)}
            value=""
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" className="text-gray-900 dark:text-gray-200">Select type...</option>
            <option value="table" className="text-gray-900 dark:text-gray-200">Table</option>
            <option value="chart" className="text-gray-900 dark:text-gray-200">Bar Chart</option>
            <option value="line" className="text-gray-900 dark:text-gray-200">Line Chart</option>
            <option value="stackedArea" className="text-gray-900 dark:text-gray-200">Stacked Area</option>
          </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={widgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <SortableWidget 
                key={widget.id} 
                widget={widget}
                data={data}
                xAxis={xAxis}
                yAxis={yAxis}
                onExpand={(widget) => setModalContent({ isOpen: true, type: widget.type, title: widget.title })}
                onRemove={(id) => setWidgets(widgets.filter(w => w.id !== id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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