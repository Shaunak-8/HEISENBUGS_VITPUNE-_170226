import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RulesEngine = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editThreshold, setEditThreshold] = useState('');
    const [toast, setToast] = useState(null);

    const loadRules = () => {
        axios.get('http://127.0.0.1:8000/rules')
            .then(res => {
                setRules(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load rules:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadRules();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const toggleRule = (ruleId, currentActive) => {
        axios.patch(`http://127.0.0.1:8000/rules/${ruleId}`, {
            is_active: !currentActive
        })
            .then(() => {
                setRules(prev => prev.map(r =>
                    r.id === ruleId ? { ...r, is_active: !currentActive } : r
                ));
                showToast(`Rule ${!currentActive ? 'activated' : 'deactivated'}`);
            })
            .catch(() => showToast('Failed to update rule', 'error'));
    };

    const startEditing = (rule) => {
        setEditingId(rule.id);
        setEditThreshold(rule.threshold.toString());
    };

    const saveThreshold = (ruleId) => {
        const newThreshold = parseFloat(editThreshold);
        if (isNaN(newThreshold)) {
            showToast('Invalid threshold value', 'error');
            return;
        }

        axios.patch(`http://127.0.0.1:8000/rules/${ruleId}`, {
            threshold: newThreshold
        })
            .then(() => {
                setRules(prev => prev.map(r =>
                    r.id === ruleId ? { ...r, threshold: newThreshold } : r
                ));
                setEditingId(null);
                showToast('Threshold updated');
            })
            .catch(() => showToast('Failed to update threshold', 'error'));
    };

    const getActionBadge = (actionType) => {
        switch (actionType) {
            case 'escalate_high':
                return { label: '→ High Risk', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
            case 'escalate_medium':
                return { label: '→ Medium Risk', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' };
            case 'set_monitoring':
                return { label: '🔍 Monitor', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' };
            default:
                return { label: actionType, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const getOperatorDisplay = (op) => {
        const map = { '>=': '≥', '<=': '≤', '>': '>', '<': '<', '==': '=' };
        return map[op] || op;
    };

    const getFieldLabel = (field) => {
        const labels = {
            'stress_type': 'Stress Type',
            'liquidity_trend': 'Liquidity Trend',
            'total_failed_autodebits': 'Failed Autodebits',
            'avg_atm_withdrawals': 'ATM Withdrawals',
            'total_lending_app_txns': 'Lending App Txns',
            'avg_salary_delay': 'Salary Delay',
            'avg_utility_delay': 'Utility Delay',
            'avg_liquidity_ratio': 'Liquidity Ratio',
            'probability': 'Probability',
        };
        return labels[field] || field;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all animate-fadeIn ${toast.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rules Engine</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure business rules that override or complement ML predictions</p>
            </div>

            {/* Info Banner */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <span className="text-xl">⚙️</span>
                    <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">How the Rules Engine Works</p>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            Rules are applied <strong>after</strong> the ML model scores a customer. They can escalate risk levels or flag accounts for monitoring.
                            Toggle rules on/off and adjust thresholds without changing code — changes take effect immediately on the next scoring.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Rules</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{rules.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Rules</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rules.filter(r => r.is_active).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Disabled Rules</p>
                    <p className="text-2xl font-bold text-gray-400">{rules.filter(r => !r.is_active).length}</p>
                </div>
            </div>

            {/* Rules Cards */}
            <div className="space-y-4">
                {rules.map((rule) => {
                    const action = getActionBadge(rule.action_type);
                    const isEditing = editingId === rule.id;

                    return (
                        <div
                            key={rule.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border transition-all ${rule.is_active
                                    ? 'border-gray-200 dark:border-gray-700'
                                    : 'border-gray-100 dark:border-gray-800 opacity-60'
                                }`}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{rule.name}</h4>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${action.color}`}>
                                                {action.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rule.description}</p>

                                        {/* Condition Display */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">IF</span>
                                            <span className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-mono">
                                                {getFieldLabel(rule.condition_field)}
                                            </span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                {getOperatorDisplay(rule.operator)}
                                            </span>

                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={editThreshold}
                                                        onChange={(e) => setEditThreshold(e.target.value)}
                                                        className="w-20 px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => saveThreshold(rule.id)}
                                                        className="text-xs px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEditing(rule)}
                                                    className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-md font-mono hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors cursor-pointer"
                                                    title="Click to edit threshold"
                                                >
                                                    {rule.threshold} ✏️
                                                </button>
                                            )}

                                            {rule.secondary_field && (
                                                <>
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AND</span>
                                                    <span className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-mono">
                                                        {getFieldLabel(rule.secondary_field)}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                        {getOperatorDisplay(rule.secondary_operator)}
                                                    </span>
                                                    <span className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-md font-mono">
                                                        {rule.secondary_threshold}
                                                    </span>
                                                </>
                                            )}

                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">THEN</span>
                                            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${action.color}`}>
                                                {action.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <div className="ml-4 flex-shrink-0">
                                        <button
                                            onClick={() => toggleRule(rule.id, rule.is_active)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rule.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${rule.is_active ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Detail */}
                                {rule.action_detail && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            💡 {rule.action_detail}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RulesEngine;
