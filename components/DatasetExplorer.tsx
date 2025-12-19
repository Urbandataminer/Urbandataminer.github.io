import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DatasetItem } from './DatasetItem';
import { Dataset } from '../types';

export const DatasetExplorer: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedTimeCoverage, setSelectedTimeCoverage] = useState<string | null>(null);

  // Load datasets on mount
  useEffect(() => {
    fetch('/all_datasets.json')
      .then(response => response.json())
      .then(data => {
        // 定义允许的类别列表
        const allowedCategories = [
          'Statical Infrastructure Data',
          'Human Behavior Data',
          'Policy & Survey Data',
          'Multimodal Sensing Data'
        ];
        
        // 定义允许的 Sub-category 列表
        const allowedSubCategories = [
          'Road networks and transportation infrastructure',
          'Building footprints and land use maps',
          'Points of Interest (POIs)',
          'Administrative boundaries and zoning maps',
          'Utility networks (electricity, water, communication)',
          'Human mobility traces (GPS, transit card, ride-hailing)',
          'Socioeconomic activities (consumption, employment, commerce)',
          'Social media interactions and online behavior',
          'Health and wellbeing data (hospitalization, surveys)',
          'Population census and household surveys',
          'Statistical yearbooks and socioeconomic indicators',
          'Government reports and planning documents',
          'Policy texts and regulatory frameworks',
          'Satellite remote sensing imagery (optical, SAR, night lights)',
          'Aerial and drone imagery',
          'Ground-based sensors (air quality, temperature, noise)',
          'Urban IoT devices (traffic, energy, water, environmental monitoring)',
          'City-wide camera networks and meteorological stations'
        ];
        
        // Transform data to match our Dataset interface
        const transformedData: Dataset[] = data.map((item: any, index: number) => {
          const originalCategory = item.Category || 'N/A';
          // 如果类别不在允许列表中，映射为 null
          const mappedCategory = allowedCategories.includes(originalCategory) 
            ? originalCategory 
            : null;
          
          const originalSubCategory = item['Sub-category'] || item.Sub_Category || 'N/A';
          // 如果 Sub-category 不在允许列表中，映射为 null
          const mappedSubCategory = allowedSubCategories.includes(originalSubCategory)
            ? originalSubCategory
            : null;
          
          return {
            id: item.id || `dataset-${index}`, // Generate ID if not present
            Data_Name: item.Data_Name || '',
            Data_summary: item.Data_summary || '',
            Category: mappedCategory,
            Sub_Category: mappedSubCategory,
            Time_Coverage: item.Time_Coverage || 'N/A',
            Geographic_Coverage: item.Geographic_Coverage || 'N/A',
            Other_Information: item.Other_Information || '',
            URL: item.URL || 'N/A',
            ref: item.ref || [],
            paper_url: item.paper_url || 'N/A'
          };
        });
        setDatasets(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load datasets:", error);
        setLoading(false);
      });
  }, []);

  // Handlers
  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(null); // Reset sub-category when main category changes
  };

  // Filter Logic
  const filteredDatasets = useMemo(() => {
    return datasets.filter(item => {
      const matchesSearch = 
        item.Data_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Data_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paper_url.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === null || 
        (selectedCategory === 'null' ? item.Category === null : item.Category === selectedCategory);
      const matchesSubCategory = selectedSubCategory === null || 
        (selectedSubCategory === 'null' ? item.Sub_Category === null : item.Sub_Category === selectedSubCategory);
      const matchesTime = selectedTimeCoverage === null || item.Time_Coverage === selectedTimeCoverage;

      return matchesSearch && matchesCategory && matchesSubCategory && matchesTime;
    });
  }, [searchTerm, selectedCategory, selectedSubCategory, selectedTimeCoverage, datasets]);

  // Dynamic Counts Logic
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    datasets.forEach(d => {
      const categoryKey = d.Category ?? 'null'; // 将 null 转换为字符串 'null' 用于显示
      counts[categoryKey] = (counts[categoryKey] || 0) + 1;
    });
    return counts;
  }, [datasets]);

  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const sourceData = selectedCategory 
        ? datasets.filter(d => {
            if (selectedCategory === 'null') {
              return d.Category === null;
            }
            return d.Category === selectedCategory;
          })
        : datasets;

    sourceData.forEach(d => {
      const subCategoryKey = d.Sub_Category ?? 'null'; // 将 null 转换为字符串 'null' 用于显示
      counts[subCategoryKey] = (counts[subCategoryKey] || 0) + 1;
    });
    return counts;
  }, [selectedCategory, datasets]);

  const timeCoverageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    datasets.forEach(d => {
      counts[d.Time_Coverage] = (counts[d.Time_Coverage] || 0) + 1;
    });
    return counts;
  }, [datasets]);

  const totalItems = filteredDatasets.length;
  
  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading datasets...</div>;
  }

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
          </h1>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-5xl space-y-4">
            {filteredDatasets.slice(0, 20).map((dataset) => (
              <DatasetItem key={dataset.id} dataset={dataset} />
            ))}

            {filteredDatasets.length > 20 && (
              <div className="text-center py-4 text-gray-500">
                Showing first 20 of {filteredDatasets.length} results...
              </div>
            )}
            
            {filteredDatasets.length === 0 && (
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
          
          {/* Footer - Removed generic pagination buttons as we use slice/infinite scroll pattern for now */}
        </div>
      </div>
    </div>
  );
};
