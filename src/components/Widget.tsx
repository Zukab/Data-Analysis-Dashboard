import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      {children}
    </div>
  );
};

export default Widget;