import { isMobile, isTablet } from 'react-device-detect'

export const IsPortrait =  window.innerWidth < window.innerHeight
export const IsMobile = isMobile ? true : false
export const IsTablet = isTablet ? true : false

export const HomeRoute = { to:'/', label: 'navigation.home'}
export const ReferencesRoute = { to: '/references', label: 'navigation.references' }
export const DatasetsRoute = { to: '/datasets', label: 'navigation.datasets' }
export const AbstractSubmissionRoute = { to: '/submit', label: 'navigation.submit' }
export const AboutRoute = { to: '/about', label: 'navigation.about' }
export const PrimaryRoutes = [
  HomeRoute,
  ReferencesRoute,
  DatasetsRoute,
  AbstractSubmissionRoute,
  AboutRoute
]
