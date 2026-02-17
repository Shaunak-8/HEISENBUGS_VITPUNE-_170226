import React, { useState } from 'react';

const WatchlistTable = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'desc' });

    // Mock data: Top 10 high-risk customers
    const watchlistData = [
        { id: 'C-1247', riskScore: 89.3, stressType: 'Severe', priority: 'P1', lastUpdated: '2 hours ago' },
        { id: 'C-0892', riskScore: 85.7, stressType: 'Severe', priority: 'P1', lastUpdated: '4 hours ago' },
        { id: 'C-1103', riskScore: 82.4, stressType: 'Severe', priority: 'P1', lastUpdated: '1 day ago' },
        { id: 'C-0456', riskScore: 78.9, stressType: 'Moderate', priority: 'P1', lastUpdated: '3 hours ago' },
        { id: 'C-1089', riskScore: 76.2, stressType: 'Moderate', priority: 'P1', lastUpdated: '5 hours ago' },
        { id: 'C-0734', riskScore: 73.8, stressType: 'Severe', priority: 'P2', lastUpdated: '6 hours ago' },
        { id: 'C-0921', riskScore: 71.5, stressType: 'Moderate', priority: 'P2', lastUpdated: '8 hours ago' },
        { id: 'C-1156', riskScore: 69.3, stressType: 'Moderate', priority: 'P2', lastUpdated: '12 hours ago' },
        { id: 'C-0567', riskScore: 67.8, stressType: 'Moderate', priority: 'P2', lastUpdated: '1 day ago' },
        { id: 'C-0812', riskScore: 65.4, stressType: 'Stable', priority: 'P2', lastUpdated: '2 days ago' }
    ];

    const [data, setData] = useState(watchlistData);

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
                        {data.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                                    {customer.lastUpdated}
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
