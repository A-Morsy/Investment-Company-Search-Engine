import React from 'react';
import CompanySearch from './components/CompanySearch';
import AddCompany from './components/AddCompany';
import logo from './assets/infineon.png';



function App() {
 return (
   <div className="min-h-screen bg-gray-50">
     <nav className="bg-white shadow mb-8" content='center'>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
        <img src={logo} alt="Logo" className="h-12 mr-2" />
        {/* <h1 className="text-3xl font-bold text-gray-900">Company Search Engine</h1> */}
      </div>
    </nav>
     <div className="max-w-7xl mx-auto px-4">
       <CompanySearch />
       <div className="my-8 border-t border-gray-200" />
       <AddCompany />
     </div>
   </div>
 );
}

export default App;