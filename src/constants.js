import { isMobile, isTablet } from 'react-device-detect'

export const IsPortrait =  window.innerWidth < window.innerHeight
export const IsMobile = isMobile ? true : false
export const IsTablet = isTablet ? true : false

export const HomeRoute = { to:'/', label: 'navigation.home'}
export const ReferencesRoute = { to: '/references', label: 'navigation.references' }
export const DatasetsRoute = { to: '/datasets', label: 'navigation.datasets' }
export const AbstractSubmissionRoute = { to: '/submit', label: 'navigation.submit' }
export const AboutRoute = { to: '/about', label: 'navigation.about' }
export const AbstractSubmissionPreviewRoute = { to:'/abstract', label: 'navigation.abstract'}
export const ArticleRoute = { to:'/article', label: 'navigation.article'}
export const ArticleHermeneuticsRoute = { to:'/article/hermeneutics', label: 'navigation.articleHermeneutics'}
export const ArticleHermeneuticsDataRoute = { to:'/article/hermeneutics,data', label: 'navigation.articleHermeneuticsData'}
export const TermsOfUseRoute = { to:'/terms', label: 'navigation.termsOfUse'}
export const GuidelinesRoute = { to:'/guidelines', label: 'navigation.guidelines'}

export const PrimaryRoutes = [
  HomeRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute,
  GuidelinesRoute,
]

export const ReCaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
export const GaTrackingId = process.env.REACT_APP_GA_TRACKING_ID

export const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:2 },
  lg: { span:8, offset:2 }
})


export const StatusIdle = 'IDLE'
export const StatusFetching = 'FETCHING'
export const StatusSuccess = 'OK'
export const StatusError = 'ERR'
export const StatusNone = 'NONE'

export const ModuleStack = 'stack'
export const ModuleTextObject = 'text_object'
export const ModuleQuote = 'quote'

export const ScrollamaThreshold = 0

export const LayerHermeneutics = 'hermeneutics'
export const LayerHermeneuticsData = 'hermeneutics,data'
export const LayerData = 'data'
export const LayerNarrative = 'narrative'
export const LayerNarrativeData = 'narrative,data'
