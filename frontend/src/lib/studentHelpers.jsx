import React from 'react';
import { Badge } from '@/components/ui/Badge';

export const BulletList = ({ items }) => {
    if (!items || items.length === 0) return <p className="text-sm text-zinc-500 dark:text-gray-400">None recorded</p>;
    return (
        <ul className="space-y-1.5">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200 font-medium">
                    <span className="text-gray-400 dark:text-gray-600 mt-0.5">&bull;</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

export const SectionSubhead = ({ children }) => (
    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{children}</p>
);

// Unified tag renderer to avoid "Objects as children" React error
export const renderTags = (data, keyIfObject = null, badgeColor = "orange") => {
    if (!data) return <p className="text-sm text-zinc-500 dark:text-gray-400 font-medium">None recorded</p>;

    let list = [];
    if (Array.isArray(data)) {
        list = data;
    } else if (typeof data === 'string') {
        list = data.split(',').map(s => s.trim()).filter(Boolean);
    } else if (typeof data === 'object') {
        if (keyIfObject && Array.isArray(data[keyIfObject])) {
            list = data[keyIfObject];
        } else {
            list = Object.values(data).find(v => Array.isArray(v)) || [];
        }
    }

    if (list.length === 0) return <p className="text-sm text-zinc-500 dark:text-gray-400 font-medium">None recorded</p>;

    return (
        <div className="flex flex-wrap gap-2 mt-1">
            {list.map((item, idx) => (
                <Badge key={idx} color={badgeColor}>{item}</Badge>
            ))}
        </div>
    );
};
