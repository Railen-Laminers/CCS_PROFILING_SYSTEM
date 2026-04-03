import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton';

const EventFilters = ({ 
    tempSearchQuery, 
    setTempSearchQuery, 
    handleSearch, 
    isSearching, 
    tempCategoryFilter, 
    setTempCategoryFilter, 
    tempStatusFilter,
    setTempStatusFilter,
    clearFilters,
    searchQuery,
    categoryFilter,
    statusFilter
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = searchQuery || categoryFilter !== 'All' || statusFilter !== 'All';

    const filterCount = (categoryFilter !== 'All' ? 1 : 0) + (statusFilter !== 'All' ? 1 : 0);

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-[1rem] shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/80 dark:ring-white/5 pointer-events-none"></div>
            <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-zinc-500 w-5 h-5 pointer-events-none" />
                    <input 
                        type="text" 
                        value={tempSearchQuery}
                        onChange={(e) => setTempSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search events by title or venue..." 
                        className="w-full h-10 pl-11 pr-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-colors" 
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
                            : 'bg-white dark:bg-[#252525] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-[#2C2C2C]'
                    }`}
                >
                    <FiFilter className="w-5 h-5" />
                    <span>Filters</span>
                    {filterCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full font-bold">
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
                        <span>Clear Filters</span>
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                            <select 
                                value={tempCategoryFilter}
                                onChange={(e) => setTempCategoryFilter(e.target.value)}
                                className="w-full h-10 px-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                            >
                                <option value="All">All Categories</option>
                                <option value="Curricular">Curricular</option>
                                <option value="Extra-Curricular">Extra-Curricular</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                            <select 
                                value={tempStatusFilter}
                                onChange={(e) => setTempStatusFilter(e.target.value)}
                                className="w-full h-10 px-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventFilters;
