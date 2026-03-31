import React from 'react';
import { FiSearch } from 'react-icons/fi';

const InstructionFilters = ({ searchQuery, setSearchQuery, primaryColor }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Active Classes</h2>
      <div className="relative group">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-brand-500" />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent w-64 transition-all duration-300 backdrop-blur-sm"
          style={{ '--tw-ring-color': primaryColor }}
        />
      </div>
    </div>
  );
};

export default InstructionFilters;
