import React, { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { DatasetItem } from './DatasetItem';
import { MOCK_DATASETS } from '../data/mockData';

export const DatasetExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedTimeCoverage, setSelectedTimeCoverage] = useState<string | null>(null);

  // Handlers
  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(null); // Reset sub-category when main category changes
  };

  // Filter Logic
  const filteredDatasets = useMemo(() => {
    return MOCK_DATASETS.filter(item => {
      const matchesSearch = 
        item.Data_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Data_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.article_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === null || item.Category === selectedCategory;
      const matchesSubCategory = selectedSubCategory === null || item.Sub_Category === selectedSubCategory;
      const matchesTime = selectedTimeCoverage === null || item.Time_Coverage === selectedTimeCoverage;

      return matchesSearch && matchesCategory && matchesSubCategory && matchesTime;
    });
  }, [searchTerm, selectedCategory, selectedSubCategory, selectedTimeCoverage]);

  // Dynamic Counts Logic
  // We calculate counts based on the GLOBAL dataset for the top-level items (like a static sidebar),
  // OR based on the currently filtered context. 
  // Standard UX: Category counts show global distribution. Sub-category counts show valid options for selected category.
  
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DATASETS.forEach(d => {
      counts[d.Category] = (counts[d.Category] || 0) + 1;
    });
    return counts;
  }, []);

  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Only show sub-categories relevant to the CURRENT selected category (if any)
    // If no category selected, maybe show all? Or top ones? Let's show all valid ones.
    const sourceData = selectedCategory 
        ? MOCK_DATASETS.filter(d => d.Category === selectedCategory)
        : MOCK_DATASETS;

    sourceData.forEach(d => {
      counts[d.Sub_Category] = (counts[d.Sub_Category] || 0) + 1;
    });
    return counts;
  }, [selectedCategory]);

  const timeCoverageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DATASETS.forEach(d => {
      counts[d.Time_Coverage] = (counts[d.Time_Coverage] || 0) + 1;
    });
    return counts;
  }, []);

  // Pagination logic (Simplified for display)
  const totalItems = filteredDatasets.length;
  
  return (
    <div className="flex h-full bg-white overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={setSelectedSubCategory}
        
        selectedTimeCoverage={selectedTimeCoverage}
        onSelectTimeCoverage={setSelectedTimeCoverage}
        
        categoryCounts={categoryCounts}
        subCategoryCounts={subCategoryCounts}
        timeCoverageCounts={timeCoverageCounts}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white min-w-0">
        {/* Header Stats */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <h1 className="text-xl text-gray-600">
            Search Results: <span className="font-semibold text-gray-900">{totalItems}</span> total items
            <span className="text-sm text-gray-400 ml-2">(Showing all matches)</span>
          </h1>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-5xl space-y-4">
            {filteredDatasets.length > 0 ? (
              filteredDatasets.map((dataset) => (
                <DatasetItem key={dataset.id} dataset={dataset} />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No datasets found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    handleCategoryChange(null);
                    setSelectedTimeCoverage(null);
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          {/* Footer / Pagination placeholder */}
          {filteredDatasets.length > 0 && (
            <div className="mt-8 py-4 border-t border-gray-100 flex justify-center">
              <nav className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
