import React, { useEffect, useState } from 'react';
import axios from 'axios';



interface Company {
  id: number;
  name: string;
  description: string;
  relevance: number;
}

interface SearchResponse {
  results: Company[];
  total_results: number;
  page: number;
  per_page: number;
}

const getRelevanceColor = (relevance: number): string => {
  if (relevance > 0.8) return '#4CAF50';
  if (relevance > 0.6) return '#2196F3';
  if (relevance > 0.4) return '#FFC107';
  return '#9E9E9E';
};



const CompanySearch = () => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage] = useState(3);

  useEffect(() => {
    const cacheKey = `searchResults_${query}_${currentPage}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setCompanies(parsedData.companies);
      setTotalResults(parsedData.totalResults);
    } else {
      searchCompanies();
    }
  }, [query, currentPage]);


  const searchCompanies = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/companies/search?q=${query}&page=${currentPage}&per_page=${resultsPerPage}`
      );
      const { results, total_results } = response.data;
      setCompanies(results);
      setTotalResults(total_results);

      const cacheKey = `searchResults_${query}_${currentPage}`;
      localStorage.setItem(cacheKey, JSON.stringify({ companies: results, totalResults: total_results }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Company Search</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchCompanies()}
          placeholder="Search companies..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={searchCompanies}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {companies.map((company) => (
        <div
          key={company.id}
          className="bg-white p-4 rounded-lg shadow-sm border m-4 hover:shadow-md transition"
          style={{
            borderLeft: `4px solid ${getRelevanceColor(company.relevance)}`,
          }}
        >
          <h2 className="text-xl font-semibold">{company.name}</h2>
          <p className="text-gray-600 mt-1">{company.description}</p>
          <div className="mt-2 flex items-center">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${company.relevance * 100}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {(company.relevance * 100).toFixed(1)}% match
            </span>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(totalResults / resultsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CompanySearch;