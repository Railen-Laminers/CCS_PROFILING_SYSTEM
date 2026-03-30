import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton';

const FacultyFilters = ({ 
    tempSearchQuery, 
    setTempSearchQuery, 
    handleSearch, 
    isSearching, 
    filters, 
    setFilters, 
    departments, 
    positions, 
    clearFilters,
    searchQuery
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = searchQuery || 
        filters.department || 
        filters.position || 
        filters.gender;

    const filterCount = (filters.department ? 1 : 0) + 
        (filters.position ? 1 : 0) + 
        (filters.gender ? 1 : 0);

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-700/50 p-5 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
            <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-500 w-5 h-5 pointer-events-none" />
                    <input 
                        type="text" 
                        value={tempSearchQuery}
                        onChange={(e) => setTempSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by name or faculty ID..." 
                        className="w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-colors" 
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="flex items-center justify-center min-w-[100px] h-10 px-4 bg-brand-500 text-white rounded-xl text-sm font-medium transition-all hover:bg-brand-400 active:scale-95 disabled:opacity-60 shadow-sm"
                >
                    {isSearching ? <Spinner className="border-white" /> : <span>Search</span>}
                </button>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 h-10 px-4 border rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm ${
                        showFilters 
                            ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-300 dark:border-brand-500/30 text-brand-700 dark:text-brand-400' 
                            : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-border-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary'
                    }`}
                >
                    <FiFilter className="w-5 h-5" />
                    <span>Filters</span>
                    {filterCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            {filterCount}
                        </span>
                    )}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 h-10 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                            <select 
                                value={filters.department}
                                onChange={(e) => setFilters({...filters, department: e.target.value})}
                                className="w-full h-10 px-3 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept, idx) => (
                                    <option key={idx} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Position Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position / Rank</label>
                            <select 
                                value={filters.position}
                                onChange={(e) => setFilters({...filters, position: e.target.value})}
                                className="w-full h-10 px-3 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Positions</option>
                                {positions.map((pos, idx) => (
                                    <option key={idx} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>

                        {/* Gender Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select 
                                value={filters.gender}
                                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                                className="w-full h-10 px-3 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyFilters;
