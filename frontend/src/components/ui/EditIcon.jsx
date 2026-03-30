import React from 'react';

const EditIcon = ({ className = "w-4 h-4" }) => {
    return (
        <svg 
            className={className}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Rounded square outline */}
            <rect 
                x="3" 
                y="3" 
                width="18" 
                height="18" 
                rx="3" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            {/* Pencil */}
            <path 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default EditIcon;
