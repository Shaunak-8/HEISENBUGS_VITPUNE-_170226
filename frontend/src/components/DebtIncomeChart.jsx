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

const DebtIncomeChart = () => {
    const { isDarkMode } = useTheme();

    // Mock data: Debt-to-Income ratio over 12 months
    const data = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Avg Debt (₹)',
                data: [180000, 185000, 190000, 195000, 188000, 192000, 198000, 205000, 200000, 195000, 190000, 185000],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Avg Income (₹)',
                data: [45000, 46000, 47000, 48000, 48500, 49000, 50000, 51000, 52000, 52500, 53000, 54000],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
                    color: isDarkMode ? '#d1d5db' : '#374151',
                    usePointStyle: true,
                    padding: 15
                }
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
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '₹' + context.parsed.y.toLocaleString('en-IN');
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Avg Debt (₹)',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151',
                    callback: function (value) {
                        return '₹' + (value / 1000) + 'K';
                    }
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
                    text: 'Avg Income (₹)',
                    color: isDarkMode ? '#9ca3af' : '#374151'
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151',
                    callback: function (value) {
                        return '₹' + (value / 1000) + 'K';
                    }
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Debt-to-Income Ratio Trend</h3>
            <div style={{ height: '280px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default DebtIncomeChart;
