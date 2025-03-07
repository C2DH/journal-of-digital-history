import React, { lazy, useEffect } from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import ReactGA from 'react-ga'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { LANGUAGE_PATH } from './logic/language'
import Page from './pages/Page'
import { useStore } from './store'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AbstractSubmission = lazy(() => import('./pages/AbstractSubmission'))
const AbstractSubmitted = lazy(() => import('./pages/AbstractSubmitted'))
const ArticlesPage = lazy(() => import('./pages/Articles'))
const CallForPapers = lazy(() => import('./pages/CallForPapers'))
// const Issue = lazy(() => import('./pages/Issue'))
const Abstract = lazy(() => import('./pages/Abstract'))
const MockAbstract = lazy(() => import('./pages/MockAbstract'))
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'))
const Playground = lazy(() => import('./pages/Playground'))
const Notebook = lazy(() => import('./pages/Notebook'))
const LocalNotebook = lazy(() => import('./pages/LocalNotebook'))
const NotebookViewer = lazy(() => import('./pages/NotebookViewer'))
const NotebookViewerForm = lazy(() => import('./pages/NotebookViewerForm'))
const Guidelines = lazy(() => import('./pages/Guidelines.v2'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ArticleViewer = lazy(() => import('./pages/ArticleViewer'))
const Fingerprint = lazy(() => import('./pages/Fingerprint'))
const FingerprintViewer = lazy(() => import('./pages/FingerprintViewer'))
const FingerprintExplained = lazy(() => import('./pages/FingerprintExplained'))
const ReleaseNotes = lazy(() => import('./pages/ReleaseNotes'))
const ReviewPolicy = lazy(() => import('./pages/ReviewPolicy'))
const Faq = lazy(() => import('./pages/Faq'))

function usePageViews() {
    const { trackPageView } = useMatomo()
    const { pathname, search } = useLocation()
    const changeBackgroundColor = useStore((state) => state.changeBackgroundColor)
  
    useEffect(() => {
      const url = [pathname, search].join('')
      console.info('pageview', url)
      changeBackgroundColor('var(--gray-100)')
      ReactGA.pageview(url)
      trackPageView({
        href: url,
      })
    }, [pathname, search, changeBackgroundColor])
}

export function AppRoutes() {
    usePageViews()
    const path = LANGUAGE_PATH
  
    return (
      <Routes>
        <Route path="/" element={<Navigate to={`${path}/`} replace />} />
        <Route path="/*" element={<Navigate to={`${path}/`} replace />} />
        <Route path={`${path}/*`} element={<Home />} />
        <Route path={`${path}/about`} element={<About />} />
        <Route path={`${path}/abstract`} element={<MockAbstract />} />
        <Route path={`${path}/abstract/:id`} element={<Abstract />} />
        <Route path={`${path}/issues`} element={<ArticlesPage />} />
        <Route path={`${path}/issue/:id`} element={<ArticlesPage />} />
        <Route path={`${path}/article/:pid`} element={<ArticleViewer />} />
        <Route path={`${path}/articles`} element={<ArticlesPage />} />
        <Route path={`${path}/abstract-submitted`} element={<AbstractSubmitted />} />
        <Route path={`${path}/terms`} element={<TermsOfUse />} />
        <Route path={`${path}/submit`} element={<AbstractSubmission />} />
        <Route path={`${path}/notebook/:encodedUrl?`} element={<Notebook />} />
        <Route path={`${path}/notebook-viewer-form`} element={<NotebookViewerForm />} />
        <Route path={`${path}/fingerprint-viewer`} element={<FingerprintViewer />} />
        <Route
          path={`${path}/fingerprint-explained/:encodedUrl?`}
          element={<FingerprintExplained />}
        />
        <Route path={`${path}/release-notes`} element={<ReleaseNotes />} />
        <Route path={`${path}/review-policy`} element={<ReviewPolicy />} />
        <Route path={`${path}/faq`} element={<Faq />} />
        <Route path={`${path}/notebook-viewer/:encodedUrl`} element={<NotebookViewer />} />
        <Route path={`${path}/local-notebook`} element={<LocalNotebook />} />
        <Route path={`${path}/playground`} element={<Playground />} />
        <Route path={`${path}/fingerprint`} element={<Fingerprint />} />
        <Route path={`${path}/guidelines`} element={<Guidelines />} />
        <Route path={`${path}/cfp/:permalink`} element={<CallForPapers />} />
        <Route path={`${path}/p/:pageId`} element={<Page />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }