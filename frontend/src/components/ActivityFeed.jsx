import React from 'react';

const ActivityFeed = () => {
    // Mock data: Recent activities
    const activities = [
        { id: 1, type: 'response', message: 'Customer C-1247 responded to intervention call', timestamp: '2 min ago', icon: '💬' },
        { id: 2, type: 'created', message: 'Payment plan created for C-0892', timestamp: '15 min ago', icon: '📝' },
        { id: 3, type: 'automated', message: 'Automated SMS sent to 12 customers', timestamp: '1 hour ago', icon: '📱' },
        { id: 4, type: 'completed', message: 'Intervention completed for C-1103 - Successful', timestamp: '2 hours ago', icon: '✅' },
        { id: 5, type: 'escalated', message: 'Case C-0456 escalated to manager', timestamp: '3 hours ago', icon: '⚠️' },
        { id: 6, type: 'response', message: 'Customer C-0734 agreed to payment plan', timestamp: '4 hours ago', icon: '💬' },
        { id: 7, type: 'failed', message: 'SMS delivery failed for C-1156', timestamp: '5 hours ago', icon: '❌' },
        { id: 8, type: 'created', message: 'New intervention assigned to Sarah K.', timestamp: '6 hours ago', icon: '📝' },
        { id: 9, type: 'automated', message: 'Daily risk assessment completed', timestamp: '8 hours ago', icon: '🔄' },
        { id: 10, type: 'completed', message: 'Call intervention completed for C-0921', timestamp: '10 hours ago', icon: '✅' },
        { id: 11, type: 'response', message: 'Customer C-0567 requested callback', timestamp: '12 hours ago', icon: '💬' },
        { id: 12, type: 'created', message: 'Email campaign initiated for 25 customers', timestamp: '14 hours ago', icon: '📧' },
        { id: 13, type: 'escalated', message: 'High-risk alert for C-0812', timestamp: '16 hours ago', icon: '⚠️' },
        { id: 14, type: 'completed', message: 'Payment received from C-0945', timestamp: '18 hours ago', icon: '✅' },
        { id: 15, type: 'automated', message: 'Weekly performance report generated', timestamp: '1 day ago', icon: '📊' }
    ];

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
                {activities.map((activity) => (
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
