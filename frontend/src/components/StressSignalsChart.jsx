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

const StressSignalsChart = () => {
    const { isDarkMode } = useTheme();

    const data = {
        labels: ['Salary Delay', 'Failed Autodebits', 'Liquidity Issues', 'Utility Delays', 'Lending App Usage'],
        datasets: [
            {
                label: 'Contribution (%)',
                data: [35, 28, 22, 10, 5],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',   // Red
                    'rgba(249, 115, 22, 0.8)',  // Orange
                    'rgba(234, 179, 8, 0.8)',   // Yellow
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(168, 85, 247, 0.8)'   // Purple
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(249, 115, 22)',
                    'rgb(234, 179, 8)',
                    'rgb(59, 130, 246)',
                    'rgb(168, 85, 247)'
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        indexAxis: 'y',
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
                        return context.parsed.x + '% of delinquency cases';
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 40,
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151',
                    callback: function (value) {
                        return value + '%';
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Contributing Stress Signals</h3>
            <div style={{ height: '280px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default StressSignalsChart;
