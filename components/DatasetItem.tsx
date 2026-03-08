import React from 'react';
import { ExternalLink, Calendar, MapPin, Tag, Hash, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dataset } from '../types';

interface DatasetItemProps {
  dataset: Dataset;
}

export const DatasetItem: React.FC<DatasetItemProps> = ({ dataset }) => {
  const navigate = useNavigate();

  const toDetail = `/dataset/${encodeURIComponent(String(dataset.id))}`;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    // Let anchors/Links behave normally (e.g., Data URL).
    if (target?.closest('a')) return;
    navigate(toDetail, { state: { dataset } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(toDetail, { state: { dataset } });
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-sm border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* Title */}
      <div className="mb-3">
        <Link
          to={toDetail}
          state={{ dataset }}
          className="text-xl font-bold text-blue-700 flex items-center gap-2 hover:underline"
        >
          {dataset.Data_Name}
        </Link>
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

        {/* Need Author Contact */}
        <div className="flex items-start gap-2">
            <User size={14} className="mt-0.5 text-amber-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Need Author Contact:</span>{' '}
                {dataset.Need_Author_Contact === true ? 'Yes' : dataset.Need_Author_Contact === false ? 'No' : 'N/A'}
            </div>
        </div>

        {/* Geographic Coverage */}
        <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 text-green-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Geographic Coverage:</span> {dataset.Geographic_Coverage}
            </div>
        </div>

        {/* Data URL */}
        <div className="flex items-start gap-2">
            <ExternalLink size={14} className="mt-0.5 text-blue-500 shrink-0" />
            <div>
                <span className="font-semibold text-gray-700">Data URL:</span> 
                {dataset.URL !== 'N/A' ? (
                  <a 
                    href={dataset.URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {dataset.URL}
                  </a>
                ) : (
                  <span className="text-gray-400 ml-1">N/A</span>
                )}
            </div>
        </div>
        
        {/* Paper URL 暂时不需要，先注释掉
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
        */}
      </div>
    </div>
  );
};
