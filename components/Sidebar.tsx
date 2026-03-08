import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  
  selectedSubCategory: string | null;
  onSelectSubCategory: (sub: string | null) => void;
  
  selectedYearBucket: string | null;
  onSelectYearBucket: (yb: string | null) => void;

  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;

  categoryCounts: Record<string, number>;
  subCategoryCounts: Record<string, number>;
  yearBucketCounts: Record<string, number>;
  countryCounts: Record<string, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  searchTerm, 
  onSearchChange,
  
  selectedCategory,
  onSelectCategory,
  
  selectedSubCategory,
  onSelectSubCategory,
  
  selectedYearBucket,
  onSelectYearBucket,

  selectedCountry,
  onSelectCountry,

  categoryCounts,
  subCategoryCounts,
  yearBucketCounts,
  countryCounts
}) => {
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subCategory: true,
    yearBucket: true,
    country: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const renderFilterItem = (
    label: string, 
    count: number, 
    isSelected: boolean, 
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full text-left text-sm py-1.5 px-2 rounded-sm transition-colors ${
        isSelected 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      }`}
    >
      <span className="truncate pr-2" title={label}>{label}</span>
      <span className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
        ({count})
      </span>
    </button>
  );

  return (
    <div className="w-full md:w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 overflow-hidden font-sans">
      
      {/* Search Section */}
      <div className="p-5 border-b border-gray-100 bg-white">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Search</h3>
        <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Please tell me your demand"
              className="w-full pl-3 pr-4 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
        </div>
        <button 
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm shadow-sm"
        >
            Search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        
        {/* Filter by Category */}
        <section>
            <button 
                onClick={() => toggleSection('category')}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Filter by Category</h3>
                {expandedSections.category ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronRight size={16} className="text-gray-400"/>}
            </button>
            
            {expandedSections.category && (
                <div className="space-y-1 pl-1">
                    {renderFilterItem('All Categories', Object.values(categoryCounts).reduce((a,b)=>a+b, 0), selectedCategory === null, () => onSelectCategory(null))}
                    {Object.entries(categoryCounts).map(([cat, count]) => (
                        renderFilterItem(cat, count, selectedCategory === cat, () => onSelectCategory(cat === selectedCategory ? null : cat))
                    ))}
                </div>
            )}
        </section>

        {/* Filter by Sub Category */}
        <section>
            <button 
                onClick={() => toggleSection('subCategory')}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Filter by Sub Category</h3>
                {expandedSections.subCategory ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronRight size={16} className="text-gray-400"/>}
            </button>
            
            {expandedSections.subCategory && (
                <div className="space-y-1 pl-1">
                    {Object.keys(subCategoryCounts).length === 0 && (
                        <p className="text-xs text-gray-400 italic px-2">Select a category to see options</p>
                    )}
                     {/* Always show 'All' option if filters are active or just generally useful */}
                    {Object.keys(subCategoryCounts).length > 0 && 
                        renderFilterItem('All Sub Categories', Object.values(subCategoryCounts).reduce((a,b)=>a+b,0), selectedSubCategory === null, () => onSelectSubCategory(null))
                    }
                    {Object.entries(subCategoryCounts).map(([sub, count]) => (
                        renderFilterItem(sub, count, selectedSubCategory === sub, () => onSelectSubCategory(sub === selectedSubCategory ? null : sub))
                    ))}
                </div>
            )}
        </section>

        {/* Filter by Year (bucketed) */}
        <section>
            <button 
                onClick={() => toggleSection('yearBucket')}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Filter by Year</h3>
                {expandedSections.yearBucket ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronRight size={16} className="text-gray-400"/>}
            </button>
            
            {expandedSections.yearBucket && (
                <div className="space-y-1 pl-1">
                     {renderFilterItem('All Years', Object.values(yearBucketCounts).reduce((a,b)=>a+b, 0), selectedYearBucket === null, () => onSelectYearBucket(null))}
                    {Object.entries(yearBucketCounts)
                      .sort(([a],[b]) => b.localeCompare(a)) // rough: "2020s" before "2010s"
                      .map(([yb, count]) => (
                        renderFilterItem(yb, count, selectedYearBucket === yb, () => onSelectYearBucket(yb === selectedYearBucket ? null : yb))
                    ))}
                </div>
            )}
        </section>

        {/* Filter by Country */}
        <section>
            <button 
                onClick={() => toggleSection('country')}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Filter by Country</h3>
                {expandedSections.country ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronRight size={16} className="text-gray-400"/>}
            </button>
            
            {expandedSections.country && (
                <div className="space-y-1 pl-1">
                     {renderFilterItem('All Countries', Object.values(countryCounts).reduce((a,b)=>a+b, 0), selectedCountry === null, () => onSelectCountry(null))}
                    {Object.entries(countryCounts)
                      .sort(([a],[b]) => {
                        const pin = (x: string) => (x === 'Global' ? 0 : x === 'Multi' ? 1 : x === 'Unknown' ? 2 : 3);
                        const pa = pin(a), pb = pin(b);
                        if (pa !== pb) return pa - pb;
                        return a.localeCompare(b);
                      })
                      .map(([c, count]) => (
                        renderFilterItem(c, count, selectedCountry === c, () => onSelectCountry(c === selectedCountry ? null : c))
                    ))}
                </div>
            )}
        </section>

      </div>
    </div>
  );
};
