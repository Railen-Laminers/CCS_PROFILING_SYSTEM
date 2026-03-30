import React from 'react';
import { Badge } from '@/components/ui/Badge';

/**
 * Renders a consistent bulleted list of items.
 */
export const BulletList = ({ items }) => {
    if (!items || items.length === 0) return <p className="text-sm text-zinc-500 dark:text-gray-400 italic">None recorded</p>;
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

/**
 * Standardized subhead for sections within a card or page.
 */
export const SectionSubhead = ({ children }) => (
    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{children}</p>
);

/**
 * Standardized date formatter.
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'Not Provided';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not Provided';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Parses data into an array, handling strings (comma-separated), arrays, or objects.
 */
export const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof data === 'object') return Object.values(data).find(v => Array.isArray(v)) || [];
    return [];
};

/**
 * Unified tag renderer to avoid "Objects as children" React errors and ensure consistent chip styling.
 */
export const renderTags = (data, badgeColor = "orange") => {
    const list = parseList(data);

    if (list.length === 0) return <p className="text-sm text-zinc-500 dark:text-gray-400 font-medium italic">None recorded</p>;

    return (
        <div className="flex flex-wrap gap-2 mt-1">
            {list.map((item, idx) => (
                <Badge key={idx} color={badgeColor}>{item}</Badge>
            ))}
        </div>
    );
};
