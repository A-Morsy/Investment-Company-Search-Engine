import React, { useState } from 'react';
import CompanySearch from './components/CompanySearch';
import AddCompany from './components/AddCompany';
import logo from './assets/infineon.png';



function App() {

  const [showAddCompany, setShowAddCompany] = useState(false);

  const toggleAddCompany = () => {
    setShowAddCompany(!showAddCompany);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Company Search Engine</h1>
          </div>
          <div>
            <button
              onClick={toggleAddCompany}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showAddCompany ? 'Hide Add Company' : 'Show Add Company'}
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4">
        <CompanySearch />
        <div className="my-8 border-t border-gray-200" />
        {showAddCompany && <AddCompany />}
      </div>
    </div>
  );
}

export default App;