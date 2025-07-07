import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import DashboardApp from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/dashboard">
      <DashboardApp />
    </BrowserRouter>
  </React.StrictMode>,
)
