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

export function AppRoutes({ languagePath = 'en' }) {
  usePageViews()
  console.debug('[AppRoutes] languagePath:', languagePath)
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`${languagePath}/`} replace />} />
      <Route path="/*" element={<Navigate to={`${languagePath}/`} replace />} />
      <Route path={`${languagePath}/*`} element={<Home />} />
      <Route path={`${languagePath}/about`} element={<About />} />
      <Route path={`${languagePath}/abstract`} element={<MockAbstract />} />
      <Route path={`${languagePath}/abstract/:id`} element={<Abstract />} />
      <Route path={`${languagePath}/issues`} element={<ArticlesPage />} />
      <Route path={`${languagePath}/issue/:id`} element={<ArticlesPage />} />
      <Route path={`${languagePath}/article/:pid`} element={<ArticleViewer />} />
      <Route path={`${languagePath}/articles`} element={<ArticlesPage />} />
      <Route path={`${languagePath}/abstract-submitted`} element={<AbstractSubmitted />} />
      <Route path={`${languagePath}/terms`} element={<TermsOfUse />} />
      <Route path={`${languagePath}/submit`} element={<AbstractSubmission />} />
      <Route path={`${languagePath}/notebook/:encodedUrl?`} element={<Notebook />} />
      <Route path={`${languagePath}/notebook-viewer-form`} element={<NotebookViewerForm />} />
      <Route path={`${languagePath}/fingerprint-viewer`} element={<FingerprintViewer />} />
      <Route
        path={`${languagePath}/fingerprint-explained/:encodedUrl?`}
        element={<FingerprintExplained />}
      />
      <Route path={`${languagePath}/release-notes`} element={<ReleaseNotes />} />
      <Route path={`${languagePath}/review-policy`} element={<ReviewPolicy />} />
      <Route path={`${languagePath}/faq`} element={<Faq />} />
      <Route path={`${languagePath}/notebook-viewer/:encodedUrl`} element={<NotebookViewer />} />
      <Route path={`${languagePath}/local-notebook`} element={<LocalNotebook />} />
      <Route path={`${languagePath}/playground`} element={<Playground />} />
      <Route path={`${languagePath}/fingerprint`} element={<Fingerprint />} />
      <Route path={`${languagePath}/guidelines/:notebook?`} element={<Guidelines />} />
      <Route path={`${languagePath}/cfp/:permalink`} element={<CallForPapers />} />
      <Route path={`${languagePath}/p/:pageId`} element={<Page />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
