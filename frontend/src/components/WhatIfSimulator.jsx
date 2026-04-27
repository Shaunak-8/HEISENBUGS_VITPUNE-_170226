import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WhatIfSimulator = ({ originalData, originalResult }) => {
    const [sliderValues, setSliderValues] = useState({ ...originalData });
    const [simResult, setSimResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const sliderConfig = [
        { key: 'avg_salary_delay', label: 'Salary Delay (days)', min: 0, max: 15, step: 0.5, icon: '💰' },
        { key: 'avg_liquidity_ratio', label: 'Liquidity Ratio', min: 0, max: 10, step: 0.1, icon: '💧' },
        { key: 'liquidity_trend', label: 'Liquidity Trend', min: -10, max: 10, step: 0.5, icon: '📉' },
        { key: 'total_failed_autodebits', label: 'Failed Autodebits', min: 0, max: 10, step: 1, icon: '❌' },
        { key: 'avg_utility_delay', label: 'Utility Delay (days)', min: 0, max: 15, step: 0.5, icon: '⚡' },
        { key: 'avg_atm_withdrawals', label: 'ATM Withdrawals', min: 0, max: 20, step: 1, icon: '🏧' },
        { key: 'total_lending_app_txns', label: 'Lending App Txns', min: 0, max: 15, step: 1, icon: '📱' },
    ];

    // Debounced simulation
    const simulate = useCallback(() => {
        setLoading(true);
        axios.post('http://127.0.0.1:8000/simulate', {
            ...sliderValues,
            week: originalData.week || 10,
        })
            .then(res => {
                setSimResult(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [sliderValues, originalData.week]);

    useEffect(() => {
        const timer = setTimeout(simulate, 300);
        return () => clearTimeout(timer);
    }, [simulate]);

    const handleSliderChange = (key, value) => {
        setSliderValues(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    const resetSliders = () => {
        setSliderValues({ ...originalData });
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'High': return 'text-red-600 dark:text-red-400';
            case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'Low': return 'text-green-600 dark:text-green-400';
            default: return 'text-gray-600';
        }
    };

    const getRiskBg = (risk) => {
        switch (risk) {
            case 'High': return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            case 'Medium': return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
            case 'Low': return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            default: return 'bg-gray-50 dark:bg-gray-700';
        }
    };

    const origProb = (originalResult.probability * 100).toFixed(1);
    const simProb = simResult ? (simResult.probability * 100).toFixed(1) : origProb;
    const probDiff = simResult ? ((simResult.probability - originalResult.probability) * 100).toFixed(1) : '0.0';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🔮 What-If Simulator
                </h3>
                <button
                    onClick={resetSliders}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    ↺ Reset
                </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag the sliders to explore how changing financial indicators affects the risk score in real-time.
            </p>

            {/* Before / After comparison */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg border ${getRiskBg(originalResult.final_risk)}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original</p>
                    <p className={`text-2xl font-bold ${getRiskColor(originalResult.final_risk)}`}>{origProb}%</p>
                    <p className={`text-sm font-medium ${getRiskColor(originalResult.final_risk)}`}>{originalResult.final_risk}</p>
                </div>

                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <span className={`text-2xl font-bold ${parseFloat(probDiff) > 0 ? 'text-red-500' : parseFloat(probDiff) < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                            {parseFloat(probDiff) > 0 ? '+' : ''}{probDiff}%
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {loading ? '⏳ Simulating...' : 'Change'}
                        </p>
                    </div>
                </div>

                <div className={`p-4 rounded-lg border ${simResult ? getRiskBg(simResult.final_risk) : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Simulated</p>
                    <p className={`text-2xl font-bold ${simResult ? getRiskColor(simResult.final_risk) : 'text-gray-400'}`}>{simProb}%</p>
                    <p className={`text-sm font-medium ${simResult ? getRiskColor(simResult.final_risk) : 'text-gray-400'}`}>
                        {simResult ? simResult.final_risk : '—'}
                    </p>
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                {sliderConfig.map(({ key, label, min, max, step, icon }) => {
                    const origVal = originalData[key] || 0;
                    const curVal = sliderValues[key] || 0;
                    const changed = curVal !== origVal;

                    return (
                        <div key={key} className={`p-3 rounded-lg transition-colors ${changed ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {icon} {label}
                                </label>
                                <div className="flex items-center gap-2">
                                    {changed && (
                                        <span className="text-xs text-gray-400 line-through">{origVal}</span>
                                    )}
                                    <span className={`text-sm font-bold ${changed ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                        {curVal}
                                    </span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={curVal}
                                onChange={(e) => handleSliderChange(key, e.target.value)}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                <span>{min}</span>
                                <span>{max}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WhatIfSimulator;
