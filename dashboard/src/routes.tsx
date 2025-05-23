import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PATH_PREFIX } from './constants/global'

const Home = lazy(() => import('./pages/Home'))
const Abstracts = lazy(() => import('./pages/Abstracts'))
const Error = lazy(() => import('./pages/Error'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATH_PREFIX}>
        <Route path="" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="abstracts" element={<Abstracts />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  )
}
