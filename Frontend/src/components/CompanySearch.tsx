import React, { useState } from 'react';
import axios from 'axios';



interface Company {
  id: number;
  name: string;
  description: string;
  relevance: number;
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

  const searchCompanies = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/companies/search?q=${query}`);
      console.log('API Response:', response.data);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
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
      
      {companies.length === 0 && query ? (
        <p className="text-gray-500">No companies found</p>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition"
              style={{
                borderLeft: `4px solid ${getRelevanceColor(company.relevance)}`
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
        </div>
      )}
    </div>
  );
};
export default CompanySearch;