import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Skeleton.jsx';

const StudentFilters = ({ 
    tempSearchQuery, 
    setTempSearchQuery, 
    handleSearch, 
    isSearching, 
    tempFilters, 
    setTempFilters, 
    sports, 
    organizations, 
    skills,
    clearFilters,
    searchQuery
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = searchQuery || 
        tempFilters.sports.length > 0 || 
        tempFilters.organizations.length > 0 || 
        tempFilters.skills.length > 0 ||
        tempFilters.year_level || 
        tempFilters.program || 
        tempFilters.gender || 
        tempFilters.gpa_min || 
        tempFilters.gpa_max;

    const filterCount = (tempFilters.sports.length || 0) + 
        (tempFilters.organizations.length || 0) + 
        (tempFilters.skills.length || 0) +
        (tempFilters.year_level ? 1 : 0) + 
        (tempFilters.program ? 1 : 0) + 
        (tempFilters.gender ? 1 : 0) + 
        (tempFilters.gpa_min ? 1 : 0) + 
        (tempFilters.gpa_max ? 1 : 0);

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
                        placeholder="Search by name or student ID..." 
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
                        <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            {filterCount}
                        </span>
                    )}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 h-[38px] px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Sports Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sports</label>
                            <select 
                                multiple
                                value={tempFilters.sports}
                                onChange={(e) => setTempFilters({...tempFilters, sports: Array.from(e.target.selectedOptions, option => option.value)})}
                                className="w-full h-[80px] px-3 py-2 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                {sports.map((sport, idx) => (
                                    <option key={idx} value={sport}>{sport}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        {/* Organizations Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organizations</label>
                            <select 
                                multiple
                                value={tempFilters.organizations}
                                onChange={(e) => setTempFilters({...tempFilters, organizations: Array.from(e.target.selectedOptions, option => option.value)})}
                                className="w-full h-[80px] px-3 py-2 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                {organizations.map((org, idx) => (
                                    <option key={idx} value={org}>{org}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        {/* Skills Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
                            <select 
                                multiple
                                value={tempFilters.skills}
                                onChange={(e) => setTempFilters({...tempFilters, skills: Array.from(e.target.selectedOptions, option => option.value)})}
                                className="w-full h-[80px] px-3 py-2 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                {skills?.map((skill, idx) => (
                                    <option key={idx} value={skill}>{skill}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        {/* Year Level Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
                            <select 
                                value={tempFilters.year_level}
                                onChange={(e) => setTempFilters({...tempFilters, year_level: e.target.value})}
                                className="w-full h-[38px] px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        {/* Program Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program</label>
                            <select 
                                value={tempFilters.program}
                                onChange={(e) => setTempFilters({...tempFilters, program: e.target.value})}
                                className="w-full h-[38px] px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Programs</option>
                                <option value="BSCS">BS Computer Science</option>
                                <option value="BSIT">BS Information Technology</option>
                            </select>
                        </div>

                        {/* Gender Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select 
                                value={tempFilters.gender}
                                onChange={(e) => setTempFilters({...tempFilters, gender: e.target.value})}
                                className="w-full h-[38px] px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* GPA Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPA Range</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    step="0.1"
                                    min="0"
                                    max="4"
                                    value={tempFilters.gpa_min}
                                    onChange={(e) => setTempFilters({...tempFilters, gpa_min: e.target.value})}
                                    placeholder="Min"
                                    className="w-1/2 h-[38px] px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                />
                                <input 
                                    type="number" 
                                    step="0.1"
                                    min="0"
                                    max="4"
                                    value={tempFilters.gpa_max}
                                    onChange={(e) => setTempFilters({...tempFilters, gpa_max: e.target.value})}
                                    placeholder="Max"
                                    className="w-1/2 h-[38px] px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFilters;
