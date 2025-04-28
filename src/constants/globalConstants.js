import { isMobile, isTablet } from 'react-device-detect'

export const IsPortrait = window.innerWidth < window.innerHeight
export const IsMobile = Boolean(isMobile)
export const IsTablet = Boolean(isTablet)

export const HomeRoute = { to: '/', label: 'navigation.home' }
export const ReferencesRoute = {
  to: '/references',
  label: 'navigation.references',
}
export const DatasetsRoute = { to: '/datasets', label: 'navigation.datasets' }
export const AbstractSubmissionRoute = {
  to: '/submit',
  label: 'navigation.submit',
}
export const AboutRoute = { to: '/about', label: 'navigation.about' }

export const ArticleRoute = { to: '/article', label: 'navigation.article' }
export const ArticleHermeneuticsRoute = {
  to: '/article/hermeneutics',
  label: 'navigation.articleHermeneutics',
}
export const ArticleHermeneuticsDataRoute = {
  to: '/article/hermeneutics,data',
  label: 'navigation.articleHermeneuticsData',
}
export const TermsOfUseRoute = { to: '/terms', label: 'navigation.termsOfUse' }
export const GuidelinesRoute = {
  to: '/guidelines',
  label: 'navigation.guidelines',
  alias: ['/guidelines/'],
}
export const FingerprintExplainedRoute = {
  to: '/fingerprint-explained',
  label: 'navigation.fingerprintExplained',
}
export const NotebookViewerFormRoute = {
  to: '/notebook-viewer-form',
  label: 'Navigation_NotebookViewer',
}
export const NotebookViewerRoute = {
  to: '/notebook-viewer',
  label: 'Navigation_NotebookViewer',
}
export const IssueRoute = { to: '/issues', label: 'navigation.issue' }
export const ArticlesRoute = {
  to: '/articles',
  label: 'navigation.issue',
  alias: ['/issues', '/article/', '/issue/'],
}
export const ReleaseNotesRoute = {
  to: '/release-notes',
  label: 'navigation.releaseNotes',
}
export const ReviewPolicy = {
  to: '/review-policy',
  label: 'navigation.reviewPolicy',
}
export const FaqRoute = { to: '/faq', label: 'navigation.faq' }

export const PrimaryRoutes = [
  HomeRoute,
  ArticlesRoute,
  AbstractSubmissionRoute,
  GuidelinesRoute,
  NotebookViewerFormRoute,
  AboutRoute,
]

export const NotebookPoweredPaths = [
  '/article/',
  '/notebook-viewer/',
  '/cfp/',
  '/guidelines/',
  '/guidelines',
]
export const ReCaptchaSiteKey = window.Cypress
  ? import.meta.env.VITE_RECAPTCHA_SITE_KEY_CYPRESS
  : import.meta.env.VITE_RECAPTCHA_SITE_KEY_APP
export const GaTrackingId = import.meta.env.VITE_GA_TRACKING_ID

export const BootstrapColumLayout = Object.freeze({
  md: { span: 8, offset: 1 },
  lg: { span: 8, offset: 2 },
})
export const BootstrapColumLayoutV3 = Object.freeze({
  narrative: BootstrapColumLayout,
  hermeneutics: {
    md: { span: 8, offset: 2 },
    lg: { span: 8, offset: 4 },
  },
  data: {
    xs: 12,
  },
})
export const BootstrapFullColumLayout = Object.freeze({
  md: { span: 10, offset: 1 },
  lg: { span: 8, offset: 2 },
})

export const BootstrapSideColumnLayout = Object.freeze({
  md: { span: 2, offset: 0 },
})
export const BootstrapMainColumnLayout = Object.freeze({
  md: { span: 6, offset: 1 },
  lg: { span: 6, offset: 2 },
})

export const BootstrapMainColumnAltLayout = Object.freeze({
  md: { span: 5, offset: 1 },
  lg: { span: 5, offset: 2 },
})
export const BootstrapSideColumnAltLayout = Object.freeze({
  md: { span: 3, offset: 0 },
})

export const BootstrapQuoteColumLayout = Object.freeze({
  md: { span: 6, offset: 3 },
  lg: { span: 6, offset: 3 },
})

export const BootstrapNarrativeStepFigureColumnLayout = Object.freeze({
  md: { span: 12 },
  lg: { span: 12 },
})

export const BootstrapNarrativeStepColumnLayout = Object.freeze({
  md: { span: 4, offset: 6 },
  lg: { span: 3, offset: 7 },
})

export const BootstrapNarrativeStepCaptionColumnLayout = Object.freeze({
  md: { span: 4, offset: 1 },
  lg: { span: 4, offset: 1 },
})

export const StatusIdle = 'idle'
export const StatusFetching = 'loading'
export const StatusSuccess = 'success'
export const StatusError = 'error'
export const StatusNone = 'none'

export const ModuleStack = 'stack'
export const ModuleTextObject = 'text_object'
export const ModuleObject = 'object'
export const ModuleQuote = 'quote'

export const ScrollamaThreshold = 0

// Cell layer choices
export const LayerNarrative = 'narrative'
export const LayerNarrativeLabel = 'narrative'
export const LayerHermeneutics = 'hermeneutics'
export const LayerHermeneuticsLabel = 'hermeneutics'
export const LayerHermeneuticsStep = 'hermeneutics-step'
export const LayerNarrativeStep = 'narrative-step'
export const LayerData = 'data'
export const LayerDataLabel = 'data & code'
export const LayerHidden = 'hidden'
export const LayerChoices = [
  LayerNarrative,
  LayerHermeneutics,
  LayerHermeneuticsStep,
  LayerData,
  LayerHidden,
  LayerNarrativeStep,
]
export const Layers = [LayerNarrative, LayerHermeneutics, LayerData]
export const LayersLabel = [LayerNarrativeLabel, LayerHermeneuticsLabel, LayerDataLabel]

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
  SectionTitle,
  SectionAbstract,
  SectionContributor,
  SectionCollaborators,
  SectionKeywords,
  SectionDisclaimer,
  SectionDefault,
]

// Cell Roles
export const RoleHidden = 'hidden'
export const RoleFigure = 'figure'
export const RoleMetadata = 'metadata'
export const RoleCitation = 'citation'
export const RoleQuote = 'quote'
export const RoleDefault = 'none' // default
export const RoleChoices = [
  RoleHidden,
  RoleFigure,
  RoleMetadata,
  RoleCitation,
  RoleQuote,
  RoleDefault,
]

export const CellTypeCode = 'code'
export const CellTypeMarkdown = 'markdown'

export const FigureImage = 'image'
export const FigureDatavis = 'vega'

export const FigureRefPrefix = 'figure-'
export const CoverRefPrefix = 'cover'
export const TableRefPrefix = 'table-'
export const DataTableRefPrefix = 'data-table-'
export const QuoteRefPrefix = 'quote-'
export const DialogRefPrefix = 'dialog-'
export const SoundRefPrefix = 'sound-'
export const VideoRefPrefix = 'video-'
export const AnchorRefPrefix = 'anchor-'
export const GalleryRefPrefix = 'gallery-'
export const AvailableFigureRefPrefixes = [
  FigureRefPrefix,
  TableRefPrefix,
  QuoteRefPrefix,
  DialogRefPrefix,
  SoundRefPrefix,
  VideoRefPrefix,
  GalleryRefPrefix,
  CoverRefPrefix,
  DataTableRefPrefix,
]
export const AvailableRefPrefixes = AvailableFigureRefPrefixes.concat([AnchorRefPrefix])

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

export const URLPathsAlwaysTrustJS = (
  import.meta.env.VITE_ALWAYS_JS_FROM_URL_PATH_PREFIX || ''
).split(',')

export const ArticleCellContainerClassNames = [
  'alert-info',
  'alert-success',
  'alert-danger',
  'alert-warning',
]

export const OrderByQueryParam = 'orderBy'
export const FilterByQueryparam = 'f'
export const OrderByIssue = 'issue'
export const OrderByPublicationDateAsc = 'dateAsc'
export const OrderByPublicationDateDesc = 'dateDesc'

export const AvailablesOrderByComparators = {
  [OrderByIssue]: () => {},
  [OrderByPublicationDateAsc]: (a, b) => a.publication_date - b.publication_date,
  [OrderByPublicationDateDesc]: (a, b) => b.publication_date - a.publication_date,
}

export const IsPrettyRecentTagName = 'new'
