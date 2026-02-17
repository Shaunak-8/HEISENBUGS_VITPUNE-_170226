import React from 'react';
import StatCard from '../components/StatCard';
import RiskTrendChart from '../components/RiskTrendChart';
import RiskDistributionChart from '../components/RiskDistributionChart';
import RiskBySegmentChart from '../components/RiskBySegmentChart';
import WatchlistTable from '../components/WatchlistTable';

const RiskOverview = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Risk Overview</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive risk analysis and early warning indicators</p>
            </div>

            {/* Early Warning Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Avg Risk Score"
                    value="42.3%"
                    icon="📊"
                    color="blue"
                    subtitle="↑ 1.2% from last month"
                />
                <StatCard
                    title="High Risk Customers"
                    value="67"
                    icon="🔴"
                    color="red"
                    subtitle="↓ 5 from last month"
                />
                <StatCard
                    title="Customers in Stress"
                    value="195"
                    icon="⚠️"
                    color="yellow"
                    subtitle="↑ 12 from last month"
                />
                <StatCard
                    title="Intervention Success"
                    value="73.5%"
                    icon="✅"
                    color="green"
                    subtitle="↓ 2.3% from last month"
                />
            </div>

            {/* Risk Trend Chart - Full Width */}
            <RiskTrendChart />

            {/* Distribution and Segment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskDistributionChart />
                <RiskBySegmentChart />
            </div>

            {/* Watchlist Table - Full Width */}
            <WatchlistTable />
        </div>
    );
};

export default RiskOverview;
