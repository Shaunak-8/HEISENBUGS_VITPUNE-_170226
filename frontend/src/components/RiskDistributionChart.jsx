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

const RiskDistributionChart = () => {
    const { isDarkMode } = useTheme();
    const data = {
        labels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
        datasets: [
            {
                label: 'Number of Customers',
                data: [45, 78, 112, 156, 189, 245, 198, 134, 67, 23],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',   // Green
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(132, 204, 22, 0.8)',  // Lime
                    'rgba(234, 179, 8, 0.8)',   // Yellow
                    'rgba(249, 115, 22, 0.8)',  // Orange
                    'rgba(249, 115, 22, 0.9)',
                    'rgba(239, 68, 68, 0.8)',   // Red
                    'rgba(239, 68, 68, 0.9)',
                    'rgba(220, 38, 38, 0.9)',
                    'rgba(185, 28, 28, 0.9)'    // Dark Red
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(34, 197, 94)',
                    'rgb(132, 204, 22)',
                    'rgb(234, 179, 8)',
                    'rgb(249, 115, 22)',
                    'rgb(249, 115, 22)',
                    'rgb(239, 68, 68)',
                    'rgb(239, 68, 68)',
                    'rgb(220, 38, 38)',
                    'rgb(185, 28, 28)'
                ],
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
                        return context.parsed.y + ' customers';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Customers',
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
                    text: 'Risk Score Range',
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Risk Distribution</h3>
            <div style={{ height: '300px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default RiskDistributionChart;
