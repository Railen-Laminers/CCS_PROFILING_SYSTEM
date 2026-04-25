import React from 'react';

const LoadingState = ({ message = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1E1E1E] rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-sm ${className}`}>
      <div className="relative">
        {/* Outer track */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-800"></div>
        {/* Animated spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 mt-5 uppercase tracking-[0.2em]">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
