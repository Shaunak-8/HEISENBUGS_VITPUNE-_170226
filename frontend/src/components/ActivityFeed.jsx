import React from 'react';

const ActivityFeed = ({ data: activities }) => {
    const feedData = activities || [];

    const getActivityColor = (type) => {
        switch (type) {
            case 'response': return 'border-l-blue-500';
            case 'created': return 'border-l-green-500';
            case 'automated': return 'border-l-purple-500';
            case 'completed': return 'border-l-green-600';
            case 'escalated': return 'border-l-red-500';
            case 'failed': return 'border-l-red-600';
            default: return 'border-l-gray-500';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real-Time Activity Feed</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {feedData.map((activity) => (
                    <div
                        key={activity.id}
                        className={`border-l-4 ${getActivityColor(activity.type)} pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                    >
                        <div className="flex items-start">
                            <span className="text-xl mr-3">{activity.icon}</span>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
