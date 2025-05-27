import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Abstracts = lazy(() => import('./pages/Abstracts'))
const Articles = lazy(() => import('./pages/Articles'))
const CallForPapers = lazy(() => import('./pages/CallForPapers'))
const Error = lazy(() => import('./pages/Error'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/abstracts" element={<Abstracts />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/callforpapers" element={<CallForPapers />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}
