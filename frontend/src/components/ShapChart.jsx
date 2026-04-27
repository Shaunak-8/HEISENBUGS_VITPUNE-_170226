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

const ShapChart = ({ shapData }) => {
    const { isDarkMode } = useTheme();

    if (!shapData || !shapData.contributions) return null;

    const contributions = shapData.contributions;
    const baseValue = shapData.base_value;

    const labels = contributions.map(c => c.feature);
    const values = contributions.map(c => c.contribution);
    const featureValues = contributions.map(c => c.value);

    // Color: green for risk-reducing, red for risk-increasing
    const bgColors = values.map(v =>
        v >= 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)'
    );
    const borderColors = values.map(v =>
        v >= 0 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'SHAP Contribution',
                data: values,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1,
            }
        ]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
                titleColor: isDarkMode ? '#000' : '#fff',
                bodyColor: isDarkMode ? '#000' : '#fff',
                callbacks: {
                    label: function (context) {
                        const idx = context.dataIndex;
                        const val = featureValues[idx];
                        const contrib = context.parsed.x;
                        const direction = contrib >= 0 ? '↑ increases' : '↓ decreases';
                        return [
                            `Value: ${val}`,
                            `${direction} risk by ${Math.abs(contrib).toFixed(4)}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '← Reduces Risk          Increases Risk →',
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    font: { size: 11, style: 'italic' }
                },
                ticks: {
                    color: isDarkMode ? '#9ca3af' : '#374151',
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
            },
            y: {
                ticks: {
                    color: isDarkMode ? '#d1d5db' : '#374151',
                    font: { size: 12, weight: '500' }
                },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🧠 SHAP Explainability
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    Base: {(baseValue * 100).toFixed(1)}% avg risk
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Each bar shows how much a feature <span className="text-red-500 font-medium">increased ↑</span> or <span className="text-green-500 font-medium">decreased ↓</span> this customer's risk relative to the portfolio average.
            </p>

            <div style={{ height: `${Math.max(200, contributions.length * 40)}px` }}>
                <Bar data={data} options={options} />
            </div>

            {/* Feature value annotations */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {contributions.slice(0, 4).map((c, i) => (
                    <div key={i} className={`text-xs p-2 rounded-lg border ${c.contribution >= 0
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        }`}>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{c.feature}</span>
                        <span className="block text-gray-500 dark:text-gray-400">= {c.value}</span>
                        <span className={`block font-semibold ${c.contribution >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {c.contribution >= 0 ? '+' : ''}{(c.contribution * 100).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShapChart;
