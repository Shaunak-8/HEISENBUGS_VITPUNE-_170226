import React from 'react';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'low':
                return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
            case 'high':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            default:
                return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'P1':
                return 'bg-red-600 text-white';
            case 'P2':
                return 'bg-orange-500 text-white';
            case 'P3':
                return 'bg-blue-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    const probability = (result.probability * 100).toFixed(2);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scoring Result</h3>

            {result.monitoring_flag && (
                <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                        <span>🔔</span>
                        Monitoring Layer Activated
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Risk Probability */}
                <div className="col-span-full text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Probability</p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{probability}%</p>
                </div>

                {/* Risk Level */}
                <div className={`p-4 rounded-lg border ${getRiskColor(result.final_risk)}`}>
                    <p className="text-sm font-medium mb-1">Risk Level</p>
                    <p className="text-2xl font-bold">{result.final_risk}</p>
                    <p className="text-xs mt-1 opacity-75">Base: {result.base_risk}</p>
                </div>

                {/* Priority Badge */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</p>
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getPriorityColor(result.priority)}`}>
                        {result.priority}
                    </span>
                </div>

                {/* Detected Stress Type */}
                {result.detected_stress_type && (
                    <div className="col-span-full p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auto-Detected Stress Type</p>
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                            {result.detected_stress_type === 'Severe' && '🔴 Severe Financial Stress'}
                            {result.detected_stress_type === 'Moderate' && '🟡 Moderate Financial Stress'}
                            {result.detected_stress_type === 'Stable' && '🟢 Stable Financial Health'}
                        </p>
                    </div>
                )}

                {/* Decision */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Decision</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{result.decision}</p>
                </div>

                {/* Recommended Action */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Action</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{result.action}</p>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
