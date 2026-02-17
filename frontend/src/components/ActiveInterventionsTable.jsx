import React, { useState } from 'react';

const ActiveInterventionsTable = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'desc' });

    // Mock data: Active interventions
    const interventionsData = [
        { customerId: 'C-1247', riskScore: 89.3, type: 'Call', status: 'In Progress', assignedTo: 'Yash Z.', nextAction: '2026-02-16', priority: 'P1' },
        { customerId: 'C-0892', riskScore: 85.7, type: 'Payment Plan', status: 'Scheduled', assignedTo: 'Shaunak S.', nextAction: '2026-02-17', priority: 'P1' },
        { customerId: 'C-1103', riskScore: 82.4, type: 'Call', status: 'Completed', assignedTo: 'Yash Z.', nextAction: '2026-02-20', priority: 'P1' },
        { customerId: 'C-0456', riskScore: 78.9, type: 'SMS', status: 'In Progress', assignedTo: 'Eklavya P.', nextAction: '2026-02-16', priority: 'P1' },
        { customerId: 'C-1089', riskScore: 76.2, type: 'Email', status: 'Scheduled', assignedTo: 'Siddhi P.', nextAction: '2026-02-18', priority: 'P1' },
        { customerId: 'C-0734', riskScore: 73.8, type: 'Call', status: 'In Progress', assignedTo: 'Yash Z.', nextAction: '2026-02-16', priority: 'P2' },
        { customerId: 'C-0921', riskScore: 71.5, type: 'Payment Plan', status: 'Completed', assignedTo: 'Shaunak S.', nextAction: '2026-02-25', priority: 'P2' },
        { customerId: 'C-1156', riskScore: 69.3, type: 'SMS', status: 'Failed', assignedTo: 'Eklavya P.', nextAction: '2026-02-17', priority: 'P2' },
        { customerId: 'C-0567', riskScore: 67.8, type: 'Call', status: 'In Progress', assignedTo: 'Siddhi P.', nextAction: '2026-02-16', priority: 'P2' },
        { customerId: 'C-0812', riskScore: 65.4, type: 'Email', status: 'Scheduled', assignedTo: 'Yash Z.', nextAction: '2026-02-19', priority: 'P2' },
        { customerId: 'C-0945', riskScore: 63.2, type: 'SMS', status: 'Completed', assignedTo: 'Eklavya P.', nextAction: '2026-02-22', priority: 'P2' },
        { customerId: 'C-1234', riskScore: 61.8, type: 'Call', status: 'In Progress', assignedTo: 'Shaunak S.', nextAction: '2026-02-16', priority: 'P2' },
        { customerId: 'C-0678', riskScore: 59.5, type: 'Payment Plan', status: 'Scheduled', assignedTo: 'Siddhi P.', nextAction: '2026-02-18', priority: 'P3' },
        { customerId: 'C-1045', riskScore: 57.3, type: 'Email', status: 'In Progress', assignedTo: 'Eklavya P.', nextAction: '2026-02-17', priority: 'P3' },
        { customerId: 'C-0889', riskScore: 55.1, type: 'SMS', status: 'Scheduled', assignedTo: 'Yash Z.', nextAction: '2026-02-19', priority: 'P3' }
    ];

    const [data, setData] = useState(interventionsData);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'text-blue-700 bg-blue-100';
            case 'Scheduled': return 'text-purple-700 bg-purple-100';
            case 'Completed': return 'text-green-700 bg-green-100';
            case 'Failed': return 'text-red-700 bg-red-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Call': return 'text-blue-700 bg-blue-50';
            case 'SMS': return 'text-green-700 bg-green-50';
            case 'Email': return 'text-purple-700 bg-purple-50';
            case 'Payment Plan': return 'text-orange-700 bg-orange-50';
            default: return 'text-gray-700 bg-gray-50';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'P1': return 'text-red-700 bg-red-100';
            case 'P2': return 'text-orange-700 bg-orange-100';
            case 'P3': return 'text-yellow-700 bg-yellow-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Interventions</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('customerId')}
                            >
                                Customer {getSortIcon('customerId')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('riskScore')}
                            >
                                Risk {getSortIcon('riskScore')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('type')}
                            >
                                Type {getSortIcon('type')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('status')}
                            >
                                Status {getSortIcon('status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Assigned To
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Next Action
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('priority')}
                            >
                                Priority {getSortIcon('priority')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((intervention) => (
                            <tr key={intervention.customerId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {intervention.customerId}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <span className="font-semibold">{intervention.riskScore}%</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(intervention.type)}`}>
                                        {intervention.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                                        {intervention.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {intervention.assignedTo}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {intervention.nextAction}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(intervention.priority)}`}>
                                        {intervention.priority}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveInterventionsTable;
