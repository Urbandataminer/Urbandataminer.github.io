import React from 'react';
import { ExternalLink, Calendar, MapPin, Tag, FileText, Hash } from 'lucide-react';
import { Dataset } from '../types';

interface DatasetItemProps {
  dataset: Dataset;
}

export const DatasetItem: React.FC<DatasetItemProps> = ({ dataset }) => {
  return (
    <div className="bg-white p-6 rounded-sm border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Title */}
      <div className="mb-3">
        <a 
          href={dataset.URL !== 'N/A' ? dataset.URL : '#'} 
          target={dataset.URL !== 'N/A' ? "_blank" : "_self"}
          rel="noopener noreferrer" 
          className={`text-xl font-bold text-blue-700 flex items-center gap-2 ${dataset.URL !== 'N/A' ? 'hover:underline' : 'cursor-default'}`}
        >
          {dataset.Data_Name}
          {dataset.URL !== 'N/A' && <ExternalLink size={16} className="text-gray-400" />}
        </a>
      </div>

      {/* Summary */}
      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
        {dataset.Data_summary}
      </p>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8 text-xs text-gray-500">
        
        {/* Category */}
        <div className="flex items-start gap-2">
            <Tag size={14} className="mt-0.5 text-indigo-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Category:</span> {dataset.Category ?? 'null'}
            </div>
        </div>

        {/* Sub Category */}
        <div className="flex items-start gap-2">
            <Hash size={14} className="mt-0.5 text-purple-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Sub Category:</span> {dataset.Sub_Category ?? 'null'}
            </div>
        </div>

        {/* Time Coverage */}
        <div className="flex items-start gap-2">
            <Calendar size={14} className="mt-0.5 text-blue-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Time Coverage:</span> {dataset.Time_Coverage}
            </div>
        </div>

        {/* Geographic Coverage */}
        <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 text-green-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Region:</span> {dataset.Geographic_Coverage}
            </div>
        </div>

        {/* Paper URL */}
        <div className="flex items-start gap-2">
            <FileText size={14} className="mt-0.5 text-gray-400 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Paper URL:</span> 
                {dataset.paper_url !== 'N/A' ? (
                  <a 
                    href={dataset.paper_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {dataset.paper_url}
                  </a>
                ) : (
                  <span className="text-gray-400 ml-1">N/A</span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
