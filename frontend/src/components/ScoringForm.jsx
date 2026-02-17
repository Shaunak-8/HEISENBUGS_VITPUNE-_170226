import React, { useState } from 'react';
import axios from 'axios';

const ScoringForm = ({ onResult }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        week: 10,
        avg_salary_delay: 3,
        avg_liquidity_ratio: 1.2,
        liquidity_trend: -3,
        total_failed_autodebits: 2,
        avg_utility_delay: 4,
        avg_atm_withdrawals: 8,
        total_lending_app_txns: 5,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/score', formData);
            onResult(response.data);
        } catch (error) {
            console.error('Error scoring customer:', error);
            alert('Failed to score customer. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Customer Scoring</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Week</label>
                        <input
                            type="number"
                            name="week"
                            value={formData.week}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Avg Salary Delay (days)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="avg_salary_delay"
                            value={formData.avg_salary_delay}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Avg Liquidity Ratio</label>
                        <input
                            type="number"
                            step="0.1"
                            name="avg_liquidity_ratio"
                            value={formData.avg_liquidity_ratio}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Liquidity Trend</label>
                        <input
                            type="number"
                            step="0.1"
                            name="liquidity_trend"
                            value={formData.liquidity_trend}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Total Failed Autodebits</label>
                        <input
                            type="number"
                            name="total_failed_autodebits"
                            value={formData.total_failed_autodebits}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Avg Utility Delay (days)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="avg_utility_delay"
                            value={formData.avg_utility_delay}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Avg ATM Withdrawals</label>
                        <input
                            type="number"
                            step="0.1"
                            name="avg_atm_withdrawals"
                            value={formData.avg_atm_withdrawals}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Total Lending App Transactions</label>
                        <input
                            type="number"
                            name="total_lending_app_txns"
                            value={formData.total_lending_app_txns}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        💡 <strong>Stress Type</strong> is automatically detected based on the financial indicators above
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Scoring...
                        </span>
                    ) : (
                        'Score Customer'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ScoringForm;
