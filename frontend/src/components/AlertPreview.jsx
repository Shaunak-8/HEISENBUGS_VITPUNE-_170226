import React, { useState } from 'react';

const AlertPreview = ({ result }) => {
    const [activeTab, setActiveTab] = useState('whatsapp');
    const [sent, setSent] = useState({});

    if (!result || (result.priority !== 'P1' && result.priority !== 'P2')) return null;

    const customerId = result.customer_id || 'C-XXXX';
    const riskPct = (result.probability * 100).toFixed(1);

    const templates = {
        whatsapp: {
            icon: '💬',
            title: 'WhatsApp Message',
            color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            bubbleColor: 'bg-green-100 dark:bg-green-800/40',
            headerColor: 'bg-green-600',
            message: `Hi! 👋\n\nThis is an important message from *Risk Analytics Bank*.\n\nWe've noticed some changes in your account activity that we'd like to discuss with you.\n\n📊 Your account has been flagged for a routine financial health check.\n\n🤝 We'd like to offer you a personalized plan to help manage your finances better.\n\nWould you like to:\n1️⃣ Schedule a call with our advisor\n2️⃣ Explore flexible payment options\n3️⃣ Learn about our financial wellness program\n\nReply with 1, 2, or 3, or type "CALLBACK" for a callback.\n\n_This is an automated message from Risk Analytics._`,
        },
        sms: {
            icon: '📱',
            title: 'SMS Alert',
            color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            bubbleColor: 'bg-blue-100 dark:bg-blue-800/40',
            headerColor: 'bg-blue-600',
            message: `[Risk Analytics Bank]\n\nDear Customer (${customerId}),\n\nWe'd like to discuss your account health. Our team is available to help with personalized financial solutions.\n\nCall us: 1800-XXX-XXXX\nOr reply CALLBACK for a free consultation.\n\nRef: ${result.priority}-${customerId}`,
        },
        email: {
            icon: '📧',
            title: 'Email Template',
            color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
            bubbleColor: 'bg-purple-100 dark:bg-purple-800/40',
            headerColor: 'bg-purple-600',
            message: `Subject: Action Required — Financial Health Review\n\nDear Valued Customer,\n\nAs part of our commitment to your financial wellbeing, we've identified that your account (${customerId}) may benefit from a personalized financial review.\n\nOur analysis indicates:\n• Risk Assessment Level: ${result.final_risk}\n• Recommended Action: ${result.action}\n• Priority: ${result.priority}\n\nWe're offering you:\n✅ Free one-on-one consultation with a financial advisor\n✅ Customized payment restructuring options\n✅ Access to our Financial Wellness Program\n\nPlease click below to schedule a convenient time:\n[Schedule Consultation]\n\nIf you have questions, reach us at support@riskanalytics.com\n\nBest regards,\nRisk Analytics — Customer Success Team`,
        }
    };

    const current = templates[activeTab];

    const handleSend = (type) => {
        setSent(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setSent(prev => ({ ...prev, [type]: false })), 3000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    📢 Alert Preview
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${result.priority === 'P1'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                    {result.priority} Alert
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Preview the automated alert that would be sent to this {result.final_risk.toLowerCase()}-risk customer.
            </p>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {Object.entries(templates).map(([key, val]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === key
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {val.icon} {val.title}
                    </button>
                ))}
            </div>

            {/* Message Preview */}
            <div className={`rounded-lg border p-4 ${current.color}`}>
                {/* Mock phone header for WhatsApp */}
                {activeTab === 'whatsapp' && (
                    <div className={`${current.headerColor} text-white px-4 py-2 rounded-t-lg -mt-4 -mx-4 mb-3 flex items-center gap-3`}>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🏦</div>
                        <div>
                            <p className="font-medium text-sm">Risk Analytics Bank</p>
                            <p className="text-xs opacity-80">Online</p>
                        </div>
                    </div>
                )}

                {activeTab === 'email' && (
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400">From: no-reply@riskanalytics.com</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">To: customer_{customerId.replace('-', '')}@email.com</p>
                    </div>
                )}

                <div className={`${current.bubbleColor} rounded-lg p-4`}>
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                        {current.message}
                    </pre>
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Auto-generated
                    </p>
                    <button
                        onClick={() => handleSend(activeTab)}
                        disabled={sent[activeTab]}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${sent[activeTab]
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                            }`}
                    >
                        {sent[activeTab] ? '✓ Sent (Demo)' : `Send ${current.icon}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertPreview;
