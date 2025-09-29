import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import DashboardApp from './App'
import CanonicalUpdater from './utils/hypothes.is/CanonicalUpdater'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/dashboard">
      <CanonicalUpdater />
      <DashboardApp />
    </BrowserRouter>
  </React.StrictMode>,
)
