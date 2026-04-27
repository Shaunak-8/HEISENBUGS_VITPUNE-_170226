import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import ActiveInterventionsTable from '../components/ActiveInterventionsTable';
import InterventionSuccessChart from '../components/InterventionSuccessChart';
import ActivityFeed from '../components/ActivityFeed';
import TeamPerformanceGrid from '../components/TeamPerformanceGrid';

const Monitoring = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/monitoring')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load monitoring:', err);
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
        return <div className="text-red-500 text-center p-8">Failed to load monitoring data. Is the backend running?</div>;
    }

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
                    value={data.stats.active_interventions.toString()}
                    icon="📋"
                    color="blue"
                    subtitle="Scheduled + In Progress"
                />
                <StatCard
                    title="Success Rate"
                    value={`${data.stats.success_rate}%`}
                    icon="✅"
                    color="green"
                    subtitle="Completed interventions"
                />
                <StatCard
                    title="Avg Response Time"
                    value={data.stats.avg_response_time}
                    icon="⏱️"
                    color="purple"
                    subtitle="Time to first contact"
                />
                <StatCard
                    title="Resolved Today"
                    value={data.stats.resolved_today.toString()}
                    icon="🎯"
                    color="yellow"
                    subtitle="Target: 20/day"
                />
            </div>

            {/* Active Interventions Table - Full Width */}
            <ActiveInterventionsTable data={data.interventions} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InterventionSuccessChart data={data.success_by_type} />
                <ActivityFeed data={data.activities} />
            </div>

            {/* Team Performance - Full Width */}
            <TeamPerformanceGrid data={data.team} />
        </div>
    );
};

export default Monitoring;
