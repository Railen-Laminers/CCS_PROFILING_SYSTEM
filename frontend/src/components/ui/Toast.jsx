import React from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        flex items-center gap-3 p-4 rounded-2xl shadow-2xl border pointer-events-auto
                        animate-in slide-in-from-bottom-4 fade-in duration-300
                        ${getToastStyles(toast.type)}
                    `}
                    role="alert"
                >
                    <div className="flex-shrink-0 text-xl">
                        {getToastIcon(toast.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate-2-lines leading-tight">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                    
                    {/* Progress Bar (Visual only for timing) */}
                    <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/20 rounded-b-2xl overflow-hidden w-full">
                        <div 
                            className="h-full bg-current opacity-30 animate-shrink" 
                            style={{ animationDuration: `${toast.duration}ms` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const getToastStyles = (type) => {
    switch (type) {
        case 'success':
            return 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-200 backdrop-blur-md';
        case 'error':
            return 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/40 dark:border-rose-800 dark:text-rose-200 backdrop-blur-md';
        case 'warning':
            return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-200 backdrop-blur-md';
        case 'info':
        default:
            return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-200 backdrop-blur-md';
    }
};

const getToastIcon = (type) => {
    switch (type) {
        case 'success':
            return <FiCheckCircle />;
        case 'error':
            return <FiXCircle />;
        case 'warning':
            return <FiAlertTriangle />;
        case 'info':
        default:
            return <FiInfo />;
    }
};

export default Toast;
