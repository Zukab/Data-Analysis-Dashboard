import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DynamicTable from './DynamicTable';
import DynamicChart from './DynamicChart';
import LineDynamicGraph from './LineDynamicGraph';
import StackedDynamicAreaChart from './StackedDynamicAreaChart';
import Widget from './Widget';

interface DashboardProps {
  data: Array<Record<string, string>>;
  headers: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, headers }) => {
  const [xAxis, setXAxis] = useState(headers[0]);
  const [yAxis, setYAxis] = useState(headers[1]);
  const [widgets, setWidgets] = useState<{ id: string; type: string; title: string }[]>([]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedWidgets = Array.from(widgets);
    const [removed] = reorderedWidgets.splice(result.source.index, 1);
    reorderedWidgets.splice(result.destination.index, 0, removed);
    setWidgets(reorderedWidgets);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const addWidget = (type: string) => {
    const newId = `widget-${widgets.length + 1}`;
    const newWidget = { id: newId, type, title: `${type}` };
    setWidgets([...widgets, newWidget]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Data Analysis Dashboard</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select X-Axis:</label>
        <select
          value={xAxis}
          onChange={(e) => setXAxis(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Y-Axis:</label>
        <select
          value={yAxis}
          onChange={(e) => setYAxis(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Widget Type:</label>
        <select
          onChange={(e) => addWidget(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select Widget Type</option>
          <option value="table">Dynamic Table</option>
          <option value="chart">Dynamic Chart</option>
          <option value="line">Line Dynamic Graph</option>
          <option value="stackedArea">Stacked Dynamic Area Chart</option>
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Widget title={widget.title}>
                        {widget.type === 'table' && <DynamicTable data={data} xAxis={xAxis} yAxis={yAxis} />}
                        {widget.type === 'chart' && <DynamicChart data={data} xAxis={xAxis} yAxis={yAxis} />}
                        {widget.type === 'line' && <LineDynamicGraph data={data} xAxis={xAxis} yAxis={yAxis} />}
                        {widget.type === 'stackedArea' && <StackedDynamicAreaChart data={data} xAxis={xAxis} yAxis={yAxis} />}
                        <button
                          onClick={() => removeWidget(widget.id)}
                          className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remove Widget
                        </button>
                      </Widget>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;