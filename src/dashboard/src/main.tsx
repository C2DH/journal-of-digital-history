import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DashboardApp from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardApp />
  </StrictMode>,
)
