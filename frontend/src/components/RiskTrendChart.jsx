import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RiskTrendChart = () => {
    const { isDarkMode } = useTheme();
    // Mock data: 12-month risk trend
    const data = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Avg Risk Score (%)',
                data: [38.5, 40.2, 41.8, 43.5, 42.1, 43.8, 45.2, 44.8, 43.5, 42.9, 42.3, 41.8],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'High Risk Customers',
                data: [52, 58, 61, 65, 63, 68, 72, 70, 68, 67, 67, 65],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    color: isDarkMode ? '#9ca3af' : '#374151'
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                titleColor: isDarkMode ? '#000' : '#fff',
                bodyColor: isDarkMode ? '#000' : '#fff'
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Avg Risk Score (%)',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'High Risk Customers',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                grid: {
                    drawOnChartArea: false
                }
            },
            x: {
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Trend Over Time (FY 2025-26)</h3>
            <div style={{ height: '300px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default RiskTrendChart;
