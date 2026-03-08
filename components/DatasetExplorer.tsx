import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { DatasetItem } from './DatasetItem';
import { Dataset } from '../types';
import { apiFetch } from '../services/api';

export const DatasetExplorer: React.FC = () => {
  // Current page datasets (server-side pagination)
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0); // filtered total from backend (browse mode) or filtered semantic result count
  const [overallTotalCount, setOverallTotalCount] = useState<number>(0); // total corpus size from /init
  const didInitRef = useRef(false);

  // 存储全量统计信息
  const [fullCategoryCounts, setFullCategoryCounts] = useState<Record<string, number>>({});
  const [fullYearBucketCounts, setFullYearBucketCounts] = useState<Record<string, number>>({});
  const [fullCountryCounts, setFullCountryCounts] = useState<Record<string, number>>({});
  const [fullSubCategoryCounts, setFullSubCategoryCounts] = useState<Record<string, number>>({});
  const [fullSubCategoryCountsByCategory, setFullSubCategoryCountsByCategory] = useState<Record<string, Record<string, number>>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [semanticResults, setSemanticResults] = useState<Dataset[] | null>(null);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedYearBucket, setSelectedYearBucket] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const buildFacetQuery = useCallback((offset: number, limit: number) => {
    const params = new URLSearchParams();
    params.set('offset', String(offset));
    params.set('limit', String(limit));
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubCategory) params.set('sub_category', selectedSubCategory);
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedYearBucket) params.set('year_bucket', selectedYearBucket);
    return `/datasets?${params.toString()}`;
  }, [selectedCategory, selectedSubCategory, selectedCountry, selectedYearBucket]);

  const fetchPage = useCallback(async (nextPageIndex: number) => {
    // Don’t interfere with semantic search mode; keep semantic results client-side for now
    if (semanticResults) return;
    const offset = nextPageIndex * pageSize;

    setPageLoading(true);
    setError(null);
    try {
      const resp = await apiFetch(buildFacetQuery(offset, pageSize));
      if (!resp.ok) throw new Error(`Failed to load datasets: ${resp.status}`);
      const data = await resp.json();
      const items: Dataset[] = (data.items || []).map((item: any, index: number) => ({
        id: item.id ?? `dataset-${offset + index}`,
        Data_Name: item.Data_Name || '',
        Data_summary: item.Data_summary || '',
        Category: item.Category || null,
        Sub_Category: item.Sub_Category || item['Sub-category'] || null,
        Time_Coverage: item.Time_Coverage || 'N/A',
        Geographic_Coverage: item.Geographic_Coverage || 'N/A',
        year_start: item.year_start ?? null,
        year_end: item.year_end ?? null,
        year_bucket: item.year_bucket || 'Unknown',
        country: item.country || 'Unknown',
        Other_Information: item.Other_Information || '',
        URL: item.URL || 'N/A',
        Need_Author_Contact: item.Need_Author_Contact ?? null,
        ref: item.ref || [],
        paper_url: item.paper_url || 'N/A',
      }));
      setDatasets(items);
      setTotalCount(data.total ?? items.length);
    } catch (e) {
      console.error(e);
      setError("Failed to load datasets. Please check backend.");
    } finally {
      setPageLoading(false);
    }
  }, [semanticResults, pageSize, buildFacetQuery]);

  // Load datasets on mount
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 后端请求通常更快，15秒超时

    // 使用相对路径：
    // - 生产环境：前端由 FastAPI 同域托管时无需关心 host/port
    // - 开发环境：Vite dev server 通过 proxy 转发到后端
    apiFetch(`/init`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Backend error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        clearTimeout(timeoutId);
        
        const transformedData: Dataset[] = (data.initial_datasets || []).map((item: any, index: number) => ({
          id: item.id ?? `dataset-${index}`,
            Data_Name: item.Data_Name || '',
            Data_summary: item.Data_summary || '',
          Category: item.Category || null,
          Sub_Category: item.Sub_Category || item['Sub-category'] || null,
            Time_Coverage: item.Time_Coverage || 'N/A',
            Geographic_Coverage: item.Geographic_Coverage || 'N/A',
            year_start: item.year_start ?? null,
            year_end: item.year_end ?? null,
            year_bucket: item.year_bucket || 'Unknown',
            country: item.country || 'Unknown',
            Other_Information: item.Other_Information || '',
            URL: item.URL || 'N/A',
            Need_Author_Contact: item.Need_Author_Contact ?? null,
            ref: item.ref || [],
            paper_url: item.paper_url || 'N/A'
        }));

        setDatasets(transformedData.slice(0, pageSize));
        setFullCategoryCounts(data.category_counts);
        setFullYearBucketCounts(data.year_bucket_counts || {});
        setFullCountryCounts(data.country_counts || {});
        setFullSubCategoryCounts(data.subcategory_counts || {});
        setFullSubCategoryCountsByCategory(data.subcategory_counts_by_category || {});
        setOverallTotalCount(data.total_count || 0);
        setTotalCount(data.total_count || 0);
        setLoading(false);
        didInitRef.current = true;
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error("Failed to load initial data:", error);
        setError("Failed to connect to backend. Please ensure the backend server is running.");
        setLoading(false);
      });
  }, [pageSize]);

  // Fetch current page when filters/page change (server-side pagination)
  useEffect(() => {
    if (!didInitRef.current) return;
    if (semanticResults) return;
    fetchPage(pageIndex);
  }, [selectedCategory, selectedSubCategory, selectedCountry, selectedYearBucket, pageIndex, pageSize, semanticResults, fetchPage]);

  // Handlers
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSemanticResults(null);
      setPageIndex(0);
      return;
    }

    setSearching(true);
    try {
      const response = await apiFetch(`/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term, top_k: 100 })
      });
      
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      const mappedDatasets = results.map((r: any) => r.data);
      setSemanticResults(mappedDatasets);
      setPageIndex(0);
    } catch (error) {
      console.error("Semantic search failed:", error);
      setSemanticResults(null);
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(null); // Reset sub-category when main category changes
    setPageIndex(0);
  };

  const handleSubCategoryChange = (sub: string | null) => {
    setSelectedSubCategory(sub);
    setPageIndex(0);
  };

  const handleYearBucketChange = (yb: string | null) => {
    setSelectedYearBucket(yb);
    setPageIndex(0);
  };

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country);
    setPageIndex(0);
  };

  // In browse mode, filtering is done on the backend via /datasets.
  // In semantic mode, results are local and we filter locally for UX consistency.
  const filteredSemanticResults = useMemo(() => {
    if (!semanticResults) return null;
    return semanticResults.filter(item => {
      // Semantic results already come from the backend for the current query.
      // Do NOT apply substring matching again; it would incorrectly filter out most results.
      const matchesText = true;

      const matchesCategory = selectedCategory === null ||
        (selectedCategory === 'null' ? (item.Category ?? null) === null : (item.Category ?? 'null') === selectedCategory);
      const matchesSubCategory = selectedSubCategory === null ||
        (selectedSubCategory === 'null' ? (item.Sub_Category ?? null) === null : (item.Sub_Category ?? 'null') === selectedSubCategory);
      const matchesYearBucket = selectedYearBucket === null || (item.year_bucket || 'Unknown') === selectedYearBucket;
      const matchesCountry = selectedCountry === null || (item.country || 'Unknown') === selectedCountry;

      return matchesText && matchesCategory && matchesSubCategory && matchesYearBucket && matchesCountry;
    });
  }, [semanticResults, selectedCategory, selectedSubCategory, selectedYearBucket, selectedCountry]);

  const effectiveTotalCount = semanticResults ? (filteredSemanticResults?.length || 0) : totalCount;

  // Pagination (semantic mode is client-side; browse mode is server-side per page)
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  useEffect(() => {
    if (pageIndex > totalPages - 1) setPageIndex(Math.max(0, totalPages - 1));
  }, [pageIndex, totalPages]);

  const semanticPageItems = useMemo(() => {
    if (!filteredSemanticResults) return null;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredSemanticResults.slice(start, end);
  }, [filteredSemanticResults, pageIndex, pageSize]);

  // Full counts from backend init
  const categoryCounts = fullCategoryCounts;
  const yearBucketCounts = fullYearBucketCounts;
  const countryCounts = fullCountryCounts;

  const subCategoryCounts = useMemo(() => {
    // If user selects a category, show only its subcategories, otherwise show global subcategory counts
    if (selectedCategory) {
      return fullSubCategoryCountsByCategory[selectedCategory] || {};
    }
    return fullSubCategoryCounts;
  }, [selectedCategory, fullSubCategoryCounts, fullSubCategoryCountsByCategory]);

  // 不在侧边栏展示 null 类别（并让 All Categories 的总数自动扣掉 null 的数量）
  const visibleCategoryCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(categoryCounts)) {
      if (k && k.toLowerCase() === 'null') continue;
      out[k] = v;
    }
    return out;
  }, [categoryCounts]);

  const nullCategoryCount = useMemo(() => {
    for (const [k, v] of Object.entries(categoryCounts)) {
      if (k && k.toLowerCase() === 'null') return v || 0;
    }
    return 0;
  }, [categoryCounts]);

  const visibleTotalCount = selectedCategory === null
    ? Math.max(0, (effectiveTotalCount || 0) - nullCategoryCount)
    : (effectiveTotalCount || 0);
  const showingSemantic = !!semanticResults;
  
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <div className="text-xl text-gray-600">Loading datasets...</div>
        <div className="text-sm text-gray-400 mt-2">This may take a minute for the 72MB data file</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <div className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</div>
        <div className="text-gray-600 mb-6 max-w-md">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={handleSubCategoryChange}

        selectedYearBucket={selectedYearBucket}
        onSelectYearBucket={handleYearBucketChange}

        selectedCountry={selectedCountry}
        onSelectCountry={handleCountryChange}
        
        categoryCounts={visibleCategoryCounts}
        subCategoryCounts={subCategoryCounts}
        yearBucketCounts={yearBucketCounts}
        countryCounts={countryCounts}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white min-w-0">
        {/* Header Stats */}
        <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
          <h1 className="text-xl text-gray-600">
            {searching ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                Searching semantically...
              </span>
            ) : (
              <>
                Datasets:{' '}
                <span className="font-semibold text-gray-900">{visibleTotalCount}</span> total items
                {showingSemantic && (
                  <span className="ml-2 text-sm text-gray-400">
                    (showing semantic matches)
                  </span>
                )}
              </>
            )}
          </h1>
          {showingSemantic && !searching && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              AI Semantic Search Active
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-5xl space-y-4">
            {pageLoading && !showingSemantic && (
              <div className="text-sm text-gray-500">Loading page…</div>
            )}

            {showingSemantic ? (
              (semanticPageItems || []).map((dataset) => (
                <DatasetItem key={dataset.id} dataset={dataset} />
              ))
            ) : (
              datasets.map((dataset) => (
                <DatasetItem key={dataset.id} dataset={dataset} />
              ))
            )}

            {((showingSemantic && (semanticPageItems?.length || 0) === 0) || (!showingSemantic && datasets.length === 0)) && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No datasets found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSemanticResults(null);
                    handleCategoryChange(null);
                    handleSubCategoryChange(null);
                    handleYearBucketChange(null);
                    handleCountryChange(null);
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="max-w-5xl mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Per page</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
                className="border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-400">
                {showingSemantic ? (
                  <>Matches: {effectiveTotalCount}</>
                ) : (
                  <>Total: {effectiveTotalCount} (of {overallTotalCount || effectiveTotalCount})</>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pageIndex <= 0 || (pageLoading && !showingSemantic)}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-gray-600">
                Page <span className="font-semibold">{pageIndex + 1}</span> / {totalPages}
              </span>
              <button
                disabled={pageIndex >= totalPages - 1 || (pageLoading && !showingSemantic)}
                onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
