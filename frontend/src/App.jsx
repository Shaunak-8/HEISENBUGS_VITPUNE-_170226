import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveScoring from './pages/LiveScoring';
import RiskOverview from './pages/RiskOverview';
import Monitoring from './pages/Monitoring';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'scoring' && <LiveScoring />}
          {activeTab === 'risk' && <RiskOverview />}
          {activeTab === 'monitoring' && <Monitoring />}
        </div>
      </div>
    </div>
  );
}

export default App;
