import React, { useState } from 'react';

const WatchlistTable = ({ data: watchlistData }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'desc' });
    const [data, setData] = useState(watchlistData || []);

    // Update data when prop changes
    React.useEffect(() => {
        setData(watchlistData || []);
    }, [watchlistData]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '⇅';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const getStressColor = (stressType) => {
        switch (stressType) {
            case 'Severe': return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30';
            case 'Moderate': return 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30';
            case 'Stable': return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30';
            default: return 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        return priority === 'P1' ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30' : 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30';
    };

    const formatTime = (isoStr) => {
        try {
            const dt = new Date(isoStr);
            const now = new Date();
            const diffMs = now - dt;
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            if (diffHrs > 0) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
            return 'Just now';
        } catch {
            return isoStr;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">High-Risk Customer Watchlist</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('id')}
                            >
                                Customer ID {getSortIcon('id')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('riskScore')}
                            >
                                Risk Score {getSortIcon('riskScore')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('stressType')}
                            >
                                Stress Type {getSortIcon('stressType')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('priority')}
                            >
                                Priority {getSortIcon('priority')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Last Updated
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((customer, idx) => (
                            <tr key={`${customer.id}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {customer.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <span className="font-semibold">{customer.riskScore}%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStressColor(customer.stressType)}`}>
                                        {customer.stressType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(customer.priority)}`}>
                                        {customer.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatTime(customer.lastUpdated)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WatchlistTable;
