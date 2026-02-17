import React from 'react';
import StatCard from '../components/StatCard';
import StressSignalsChart from '../components/StressSignalsChart';
import DebtIncomeChart from '../components/DebtIncomeChart';

const Dashboard = () => {
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
                    title="Total Loans Issued"
                    value="1,247"
                    icon="📊"
                    color="blue"
                    subtitle="FY 2025-26"
                />
                <StatCard
                    title="New Loans (Monthly)"
                    value="104"
                    icon="📈"
                    color="green"
                    subtitle="Average per month"
                />
                <StatCard
                    title="Avg Loan Size"
                    value="₹2.45L"
                    icon="💰"
                    color="purple"
                    subtitle="Per customer"
                />
                <StatCard
                    title="Probability of Default"
                    value="15.3%"
                    icon="⚠️"
                    color="yellow"
                    subtitle="Portfolio-wide"
                />
            </div>

            {/* Secondary Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Expected Loss"
                    value="₹45.9M"
                    icon="📉"
                    color="red"
                    subtitle="Estimated exposure"
                />
                <StatCard
                    title="Total Loan Amount"
                    value="₹310.5Cr"
                    icon="🏦"
                    color="blue"
                    subtitle="Outstanding portfolio"
                />
                <StatCard
                    title="High Risk Cases"
                    value="67"
                    icon="🔴"
                    color="red"
                    subtitle="Requires immediate action"
                />
                <StatCard
                    title="Medium Risk Cases"
                    value="128"
                    icon="🟡"
                    color="yellow"
                    subtitle="Monitor closely"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StressSignalsChart />
                <DebtIncomeChart />
            </div>

            {/* Quick Statistics Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P1 Priority Cases</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">23</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P2 Priority Cases</p>
                        <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">44</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Monitoring</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Risk Score</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">42.3%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
