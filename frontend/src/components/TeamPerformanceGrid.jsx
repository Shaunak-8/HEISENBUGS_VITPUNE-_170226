import React from 'react';

const TeamPerformanceGrid = ({ data: teamData }) => {
    const team = teamData || [];

    const getSuccessRateColor = (rate) => {
        if (rate >= 85) return 'text-green-700 bg-green-100';
        if (rate >= 75) return 'text-blue-700 bg-blue-100';
        return 'text-yellow-700 bg-yellow-100';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member) => (
                    <div
                        key={member.agent}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{member.agent}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuccessRateColor(member.successRate)}`}>
                                {member.successRate}%
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Active Cases:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{member.activeCases}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{member.avgResponseTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Total Resolved:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{member.totalResolved}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPerformanceGrid;
