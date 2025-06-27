import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Abstracts = lazy(() => import('./pages/Abstracts'))
const Articles = lazy(() => import('./pages/Articles'))
const CallForPapers = lazy(() => import('./pages/CallForPapers'))
const Detail = lazy(() => import('./pages/Detail'))
const Issues = lazy(() => import('./pages/Issues'))
const Authors = lazy(() => import('./pages/Authors'))
const Datasets = lazy(() => import('./pages/Datasets'))
const Error = lazy(() => import('./pages/Error'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/abstracts" element={<Abstracts />} />
      <Route path="/abstracts/:id" element={<Detail endpoint="/api/abstracts/" />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<Detail endpoint="/api/articles/" />} />
      <Route path="/callforpapers" element={<CallForPapers />} />
      <Route path="/issues" element={<Issues />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/datasets" element={<Datasets />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}
