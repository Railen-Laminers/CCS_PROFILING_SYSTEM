import React from 'react';
import { FiInbox, FiPlus } from 'react-icons/fi';

const EmptyState = ({ 
    icon: Icon = FiInbox, 
    title, 
    description, 
    action,
    size = 'lg',
    className = "" 
}) => {
    const isSmall = size === 'md';

    return (
        <div className={`col-span-full flex flex-col items-center justify-center ${isSmall ? 'py-10 px-4 rounded-2xl' : 'py-20 px-6 rounded-3xl'} bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden ${className}`}>
            {/* Icon Container */}
            <div className={`relative ${isSmall ? 'mb-4' : 'mb-6'}`}>
                <div className={`${isSmall ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner transition-colors duration-500`}>
                    <Icon className={`${isSmall ? 'w-6 h-6' : 'w-8 h-8'} text-gray-300 dark:text-zinc-700`} />
                </div>
            </div>

            {/* Content */}
            <div className="text-center relative z-10 max-w-sm px-4">
                <h3 className={`${isSmall ? 'text-sm' : 'text-xl'} font-bold text-gray-900 dark:text-white mb-1 leading-snug tracking-tight`}>
                    {title}
                </h3>
                {description && (
                    <p className={`${isSmall ? 'text-[11px]' : 'text-sm'} text-gray-400 dark:text-zinc-500 leading-relaxed font-medium`}>
                        {description}
                    </p>
                )}
            </div>

            {/* Action Button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className={`relative group/btn overflow-hidden rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 ${isSmall ? 'mt-4 px-4 py-1.5 text-[11px]' : 'mt-8 px-6 py-2.5 text-sm font-semibold'}`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <FiPlus className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} group-hover/btn:rotate-90 transition-transform duration-300`} /> 
                        {action.label}
                    </span>
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl bg-white/20 transition-all duration-300 group-hover/btn:scale-100"></div>
                </button>
            )}
        </div>
    );
};

export default EmptyState;
