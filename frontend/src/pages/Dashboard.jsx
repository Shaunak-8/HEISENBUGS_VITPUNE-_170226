import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import StressSignalsChart from '../components/StressSignalsChart';
import DebtIncomeChart from '../components/DebtIncomeChart';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load dashboard:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-red-500 text-center p-8">Failed to load dashboard data. Is the backend running?</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Loan portfolio overview and risk analytics (FY 2025-26)</p>
            </div>

            {/* Primary Loan Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Customers Scored"
                    value={data.total_scored.toLocaleString()}
                    icon="📊"
                    color="blue"
                    subtitle="All time"
                />
                <StatCard
                    title="Low Risk Customers"
                    value={data.low_risk_count.toLocaleString()}
                    icon="📈"
                    color="green"
                    subtitle="Healthy portfolio"
                />
                <StatCard
                    title="Avg Default Probability"
                    value={`${data.avg_probability}%`}
                    icon="💰"
                    color="purple"
                    subtitle="Portfolio-wide"
                />
                <StatCard
                    title="Probability of Default"
                    value={`${data.avg_probability}%`}
                    icon="⚠️"
                    color="yellow"
                    subtitle="Portfolio-wide"
                />
            </div>

            {/* Secondary Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Expected Loss"
                    value={`₹${((data.high_risk_count * 50000 * 0.7 + data.medium_risk_count * 50000 * 0.47) / 1000000).toFixed(1)}M`}
                    icon="📉"
                    color="red"
                    subtitle="Estimated exposure"
                />
                <StatCard
                    title="Total Loan Amount"
                    value={`₹${(data.total_scored * 2.45).toFixed(1)}Cr`}
                    icon="🏦"
                    color="blue"
                    subtitle="Outstanding portfolio"
                />
                <StatCard
                    title="High Risk Cases"
                    value={data.high_risk_count.toString()}
                    icon="🔴"
                    color="red"
                    subtitle="Requires immediate action"
                />
                <StatCard
                    title="Medium Risk Cases"
                    value={data.medium_risk_count.toString()}
                    icon="🟡"
                    color="yellow"
                    subtitle="Monitor closely"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StressSignalsChart data={data.stress_signals} />
                <DebtIncomeChart data={data.weekly_trend} />
            </div>

            {/* Quick Statistics Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P1 Priority Cases</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.p1_count}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P2 Priority Cases</p>
                        <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{data.p2_count}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Monitoring</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.monitoring_count}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Risk Score</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.avg_probability}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
