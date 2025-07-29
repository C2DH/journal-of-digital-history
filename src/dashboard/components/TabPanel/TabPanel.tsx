import './TabPanel.css'

import { useState } from 'react'

import { TabPanelProps } from './interface'

const TabPanel = ({ tabs }: TabPanelProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')

  const handleTabClick = (index: number) => {
    setTransitionDirection(index > activeTab ? 'right' : 'left')
    setActiveTab(index)
  }

  return (
    <div className="tab-panel">
      <div className="tab-navigation">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`tab-content ${transitionDirection}`}>
        {tabs.map((tab, index) => (
          <div key={index} className={`tab-pane ${activeTab === index ? 'active' : ''}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabPanel
