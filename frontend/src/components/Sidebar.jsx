import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'scoring', label: 'Live Scoring', icon: '🎯' },
        { id: 'risk', label: 'Risk Overview', icon: '⚠️' },
        { id: 'monitoring', label: 'Monitoring', icon: '👁️' },
    ];

    return (
        <div className="w-64 bg-gray-900 dark:bg-gray-800 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl transition-colors duration-200">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-800 dark:border-gray-700">
                <h1 className="text-xl font-bold text-blue-400">Pre-Delinquency</h1>
                <p className="text-xs text-gray-400 mt-1">Intervention Engine</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 flex items-center gap-3 ${activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer with Dark Mode Toggle */}
            <div className="p-4 border-t border-gray-800 dark:border-gray-700 space-y-3">
                <button
                    onClick={toggleTheme}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    aria-label="Toggle dark mode"
                >
                    <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
                    <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <p className="text-xs text-gray-500 text-center">© 2026 Risk Analytics</p>
            </div>
        </div>
    );
};

export default Sidebar;
