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
export const TermsOfUseRoute = { to:'/terms', label: 'navigation.termsOfUse'}
export const PrimaryRoutes = [
  HomeRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute
]

export const ReCaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
export const GaTrackingId = process.env.REACT_APP_GA_TRACKING_ID

export const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:2 },
  lg: { span:7, offset:2 }
})
