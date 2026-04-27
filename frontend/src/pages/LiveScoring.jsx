import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScoringForm from '../components/ScoringForm';
import ResultCard from '../components/ResultCard';

const LiveScoring = () => {
    const [scoringResult, setScoringResult] = useState(null);
    const [history, setHistory] = useState([]);

    const loadHistory = () => {
        axios.get('http://127.0.0.1:8000/scoring-history')
            .then(res => setHistory(res.data))
            .catch(err => console.error('Failed to load history:', err));
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleResult = (result) => {
        setScoringResult(result);
        // Refresh history after new score
        setTimeout(loadHistory, 500);
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'High': return 'text-red-600 dark:text-red-400';
            case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'Low': return 'text-green-600 dark:text-green-400';
            default: return 'text-gray-600';
        }
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            'P1': 'bg-red-100 text-red-700',
            'P2': 'bg-orange-100 text-orange-700',
            'P3': 'bg-blue-100 text-blue-700',
        };
        return colors[priority] || 'bg-gray-100 text-gray-700';
    };

    const formatTime = (isoStr) => {
        try {
            const dt = new Date(isoStr);
            const now = new Date();
            const diffMs = now - dt;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays > 0) return `${diffDays}d ago`;
            if (diffHrs > 0) return `${diffHrs}h ago`;
            if (diffMins > 0) return `${diffMins}m ago`;
            return 'Just now';
        } catch {
            return isoStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Customer Scoring</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Score individual customers in real-time using behavioral indicators</p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>How it works:</strong> Enter customer financial indicators below. The system will automatically detect stress levels and provide risk assessment with recommended actions. Results are saved to the database and reflected across all dashboards.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scoring Form - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <ScoringForm onResult={handleResult} />
                </div>

                {/* Info Panel - Takes 1 column */}
                <div className="space-y-6">
                    {/* Scoring Guide */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Risk Bands</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                                <span className="text-sm font-medium text-red-900 dark:text-red-300">High Risk</span>
                                <span className="text-xs text-red-700 dark:text-red-400">≥ 50%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Medium Risk</span>
                                <span className="text-xs text-yellow-700 dark:text-yellow-400">30-50%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                                <span className="text-sm font-medium text-green-900 dark:text-green-300">Low Risk</span>
                                <span className="text-xs text-green-700 dark:text-green-400">&lt; 30%</span>
                            </div>
                        </div>
                    </div>

                    {/* Stress Type Guide */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Stress Detection</h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-start">
                                <span className="text-red-500 mr-2">🔴</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Severe</p>
                                    <p className="text-xs">2+ critical indicators</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">🟡</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Moderate</p>
                                    <p className="text-xs">3+ warning signs</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">🟢</span>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Stable</p>
                                    <p className="text-xs">Healthy financial behavior</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Card - Full Width */}
            {scoringResult && (
                <div className="mt-6">
                    <ResultCard result={scoringResult} />
                </div>
            )}

            {/* Scoring History */}
            {history.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Recent Scoring History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Probability</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Risk</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stress</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Priority</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">When</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {history.slice(0, 10).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.customer_id}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{(item.probability * 100).toFixed(1)}%</td>
                                        <td className={`px-4 py-3 text-sm font-semibold ${getRiskColor(item.final_risk)}`}>{item.final_risk}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.detected_stress_type}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.action}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatTime(item.scored_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveScoring;
