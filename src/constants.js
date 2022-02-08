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
export const NotebookViewerRoute = { to:'/notebook-viewer-form', label: 'Navigation_NotebookViewer'}
export const IssueRoute = { to:'/issues', label: 'navigation.issue'}
export const ArticlesRoute = { to:'/articles', label: 'navigation.issue'}

export const PrimaryRoutes = [
  HomeRoute,
  // IssueRoute,
  ArticlesRoute,
  // ReferencesRoute,
  // DatasetsRoute,
  AbstractSubmissionRoute,
  GuidelinesRoute,
  NotebookViewerRoute,
  AboutRoute,
]

export const NotebookPoweredPaths = [
  '/article/',
  '/notebook-viewer/',
  '/cfp/',
  '/guidelines/'
]
export const ReCaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
export const GaTrackingId = process.env.REACT_APP_GA_TRACKING_ID

export const BootstrapColumLayout = Object.freeze({
  md: { span:8, offset:1 },
  lg: { span:8, offset:2 }
})

export const BootstrapQuoteColumLayout = Object.freeze({
  md: { span:6, offset:3 },
  lg: { span:6, offset:3 }
})

export const BootstrapNarrativeStepFigureColumnLayout = Object.freeze({
  md: { span:12 },
  lg: { span:12 }
})

export const BootstrapNarrativeStepColumnLayout = Object.freeze({
  md: { span:4, offset:6 },
  lg: { span:3, offset:7 }
})

export const BootstrapNarrativeStepCaptionColumnLayout = Object.freeze({
  md: { span:4, offset:1 },
  lg: { span:4, offset:1 }
})

export const StatusIdle = 'IDLE'
export const StatusFetching = 'FETCHING'
export const StatusSuccess = 'OK'
export const StatusError = 'ERR'
export const StatusNone = 'NONE'

export const ModuleStack = 'stack'
export const ModuleTextObject = 'text_object'
export const ModuleObject = 'object'
export const ModuleQuote = 'quote'

export const ScrollamaThreshold = 0


// Cell layer choices
export const LayerNarrative = 'narrative'
export const LayerHermeneutics = 'hermeneutics'
export const LayerHermeneuticsStep = 'hermeneutics-step'
export const LayerNarrativeStep = 'narrative-step'
export const LayerData = 'data'
export const LayerHidden = 'hidden'
export const LayerChoices = [
  LayerNarrative, LayerHermeneutics, LayerHermeneuticsStep, LayerData,
  LayerHidden, LayerNarrativeStep
]

// Cell sections
export const SectionTitle = 'title'
export const SectionAbstract = 'abstract'
export const SectionContributor = 'contributor'
export const SectionCollaborators = 'collaborators'
export const SectionKeywords = 'keywords'
export const SectionCover = 'cover'
export const SectionDisclaimer = 'disclaimer'
export const SectionDefault = 'text' // default
export const SectionChoices = [
  SectionTitle, SectionAbstract, SectionContributor,
  SectionCollaborators,
  SectionKeywords, SectionDisclaimer, SectionDefault
]

// Cell Roles
export const RoleHidden = 'hidden'
export const RoleFigure = 'figure'
export const RoleMetadata = 'metadata'
export const RoleCitation = 'citation'
export const RoleQuote = 'quote'
export const RoleDefault = 'none' // default
export const RoleChoices = [
  RoleHidden, RoleFigure,
  RoleMetadata, RoleCitation, RoleQuote,
  RoleDefault
]

export const CellTypeCode = 'code'
export const CellTypeMarkdown = 'markdown'

export const FigureImage = 'image'
export const FigureDatavis = 'vega'

export const FigureRefPrefix = 'figure-'
export const CoverRefPrefix = 'cover'
export const TableRefPrefix = 'table-'
export const QuoteRefPrefix = 'quote-'
export const AnchorRefPrefix = 'anchor-'
// display Layer to enable switch between layers
export const DisplayLayerHermeneutics = 'h'
export const DisplayLayerNarrative = 'n'
export const DisplayLayerAll = 'all'
// available sections to link to
export const DisplayLayerSectionBibliography = 'bib'
export const DisplayLayerSectionHeader = 'head'
export const DisplayLayerSectionFooter = 'foo'
// names of the query parameters available
export const DisplayLayerQueryParam = 'layer'
export const DisplayPreviousLayerQueryParam = 'pl'
export const DisplayLayerCellIdxQueryParam = 'idx'
export const DisplayPreviousCellIdxQueryParam = 'pidx'
export const DisplayLayerCellTopQueryParam = 'y'
export const DisplayLayerHeightQueryParam = 'lh'
export const DisplayLayerSectionParam = 's'
// article status
export const ArticleStatusPublished = 'PUBLISHED'
export const ArticleStatusDraft = 'Draft'
// article component version
export const ArticleVersionQueryParam = 'v'
