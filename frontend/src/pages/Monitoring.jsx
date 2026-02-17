import React from 'react';
import StatCard from '../components/StatCard';
import ActiveInterventionsTable from '../components/ActiveInterventionsTable';
import InterventionSuccessChart from '../components/InterventionSuccessChart';
import ActivityFeed from '../components/ActivityFeed';
import TeamPerformanceGrid from '../components/TeamPerformanceGrid';

const Monitoring = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Monitoring</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Active interventions and team performance tracking</p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Interventions"
                    value="64"
                    icon="📋"
                    color="blue"
                    subtitle="↑ 8 from yesterday"
                />
                <StatCard
                    title="Success Rate"
                    value="76.5%"
                    icon="✅"
                    color="green"
                    subtitle="↑ 3.2% this week"
                />
                <StatCard
                    title="Avg Response Time"
                    value="2.4 hrs"
                    icon="⏱️"
                    color="purple"
                    subtitle="↓ 0.5 hrs from last week"
                />
                <StatCard
                    title="Resolved Today"
                    value="18"
                    icon="🎯"
                    color="yellow"
                    subtitle="Target: 20/day"
                />
            </div>

            {/* Active Interventions Table - Full Width */}
            <ActiveInterventionsTable />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InterventionSuccessChart />
                <ActivityFeed />
            </div>

            {/* Team Performance - Full Width */}
            <TeamPerformanceGrid />
        </div>
    );
};

export default Monitoring;
