import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RiskBySegmentChart = ({ data: segmentData }) => {
    const { isDarkMode } = useTheme();

    const labels = segmentData?.map(d => d.stress_type) || [];
    const values = segmentData?.map(d => d.avg_risk) || [];

    const colorMap = {
        'Severe': { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' },
        'Moderate': { bg: 'rgba(234, 179, 8, 0.8)', border: 'rgb(234, 179, 8)' },
        'Stable': { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' },
    };

    const bgColors = labels.map(l => colorMap[l]?.bg || 'rgba(156, 163, 175, 0.8)');
    const borderColors = labels.map(l => colorMap[l]?.border || 'rgb(156, 163, 175)');

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Avg Risk Score (%)',
                data: values,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                titleColor: isDarkMode ? '#000' : '#fff',
                bodyColor: isDarkMode ? '#000' : '#fff',
                callbacks: {
                    label: function (context) {
                        return 'Avg Risk: ' + context.parsed.y + '%';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Average Risk Score (%)',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Stress Type Segment',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk by Stress Type Segment</h3>
            <div style={{ height: '300px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default RiskBySegmentChart;
