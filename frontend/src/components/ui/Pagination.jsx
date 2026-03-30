import React from 'react';

const Pagination = ({ pagination, currentPage, onPageChange }) => {
    if (!pagination || pagination.last_page <= 1) {
        if (pagination?.total > 0) {
            return (
                <div className="mt-4 px-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.total}</span> result{pagination.total !== 1 ? 's' : ''}
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{((pagination.current_page - 1) * pagination.per_page) + 1}</span>
                -<span className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{pagination.total}</span> students
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={pagination.current_page <= 1}
                    className="px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                    let page;
                    if (pagination.last_page <= 5) {
                        page = i + 1;
                    } else if (pagination.current_page <= 3) {
                        page = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                        page = pagination.last_page - 4 + i;
                    } else {
                        page = pagination.current_page - 2 + i;
                    }
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                                page === pagination.current_page
                                    ? 'bg-brand-500 text-white shadow-sm'
                                    : 'border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, pagination.last_page))}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
