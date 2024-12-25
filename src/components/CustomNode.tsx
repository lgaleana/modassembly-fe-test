import React from 'react';
import { Handle, Position } from 'reactflow';
import { ArchitectureNode } from '../types';

interface CustomNodeProps {
  data: ArchitectureNode;
}

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-100 min-w-64">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-500" />
      
      <div className="flex items-center gap-2">
        <div className="text-xs font-mono px-2 py-1 bg-gray-100 rounded text-gray-600">
          {data.type}
        </div>
        {data.is_endpoint && (
          <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
            endpoint
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h2 className="text-lg font-semibold text-gray-900">{data.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{data.purpose}</p>
      </div>
      
      {data.pypi_packages.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-gray-500 mb-1">Dependencies:</div>
          <div className="flex flex-wrap gap-1">
            {data.pypi_packages.slice(0, 2).map((pkg) => (
              <span key={pkg} className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                {pkg.split('==')[0]}
              </span>
            ))}
            {data.pypi_packages.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                +{data.pypi_packages.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-500" />
    </div>
  );
}
