import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import RiskTrendChart from '../components/RiskTrendChart';
import RiskDistributionChart from '../components/RiskDistributionChart';
import RiskBySegmentChart from '../components/RiskBySegmentChart';
import WatchlistTable from '../components/WatchlistTable';

const RiskOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/risk-overview')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load risk overview:', err);
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
        return <div className="text-red-500 text-center p-8">Failed to load risk overview. Is the backend running?</div>;
    }

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
                    value={`${data.stats.avg_risk}%`}
                    icon="📊"
                    color="blue"
                    subtitle="Portfolio average"
                />
                <StatCard
                    title="High Risk Customers"
                    value={data.stats.high_risk_count.toString()}
                    icon="🔴"
                    color="red"
                    subtitle="Requires action"
                />
                <StatCard
                    title="Customers in Stress"
                    value={data.stats.stressed_count.toString()}
                    icon="⚠️"
                    color="yellow"
                    subtitle="Moderate + Severe"
                />
                <StatCard
                    title="Intervention Success"
                    value={`${data.stats.intervention_success_rate}%`}
                    icon="✅"
                    color="green"
                    subtitle="Completed interventions"
                />
            </div>

            {/* Risk Trend Chart - Full Width */}
            <RiskTrendChart data={data.trend} />

            {/* Distribution and Segment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskDistributionChart data={data.distribution} />
                <RiskBySegmentChart data={data.segments} />
            </div>

            {/* Watchlist Table - Full Width */}
            <WatchlistTable data={data.watchlist} />
        </div>
    );
};

export default RiskOverview;
