// src/components/AddCompany.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface AddCompanyProps {
 onCompanyAdded?: () => void;
}

const AddCompany: React.FC<AddCompanyProps> = ({ onCompanyAdded }) => {
 const [formData, setFormData] = useState({ name: '', description: '' });
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:5000/api/companies', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response.data);  // Debug log
    setFormData({ name: '', description: '' });
    onCompanyAdded?.();
  } catch (err: any) {
    console.error('Error:', err);  // Debug log
    setError(err.response?.data?.error || 'Failed to add company');
  } finally {
    setIsLoading(false);
  }
};

 return (
   <div className="max-w-4xl mx-auto p-4">
     <h2 className="text-2xl font-bold mb-4">Add New Company</h2>
     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block text-sm font-medium mb-1">Company Name</label>
         <input
           type="text"
           value={formData.name}
           onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
           className="w-full p-2 border rounded"
           required
         />
       </div>
       <div>
         <label className="block text-sm font-medium mb-1">Description</label>
         <textarea
           value={formData.description}
           onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
           className="w-full p-2 border rounded h-32"
           required
         />
       </div>
       {error && <p className="text-red-500">{error}</p>}
       <button
         type="submit"
         disabled={isLoading}
         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
       >
         {isLoading ? 'Adding...' : 'Add Company'}
       </button>
     </form>
   </div>
 );
};

export default AddCompany;