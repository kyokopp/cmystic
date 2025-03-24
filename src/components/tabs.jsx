import React from 'react';

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      <nav className="tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};