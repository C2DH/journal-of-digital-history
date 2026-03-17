import {
  CheckCircleOutlined,
  EditOutlined,
  Inventory2Outlined,
  PaletteOutlined,
  RocketLaunchOutlined,
  SettingsOutlined,
  ShareOutlined,
  UploadFileOutlined,
} from '@mui/icons-material'

export const articleSteps = [
  { key: 'draft', label: 'Writing', icon: <UploadFileOutlined /> },
  { key: 'technical_review', label: 'Technical Review', icon: <SettingsOutlined /> },
  { key: 'peer_review', label: 'Peer Review', icon: <CheckCircleOutlined /> },
  { key: 'design_review', label: 'Design Review', icon: <PaletteOutlined /> },
  { key: 'copy_editing', label: 'Copy editing', icon: <EditOutlined /> },
  { key: 'published', label: 'Published', icon: <RocketLaunchOutlined /> },
  { key: 'social', label: 'Social', icon: <ShareOutlined /> },
  { key: 'archived', label: 'Archived', icon: <Inventory2Outlined /> },
]

export const articleStatus = [
  { key: 1, value: 'DRAFT', label: 'Writing' },
  { key: 2, value: 'TECHNICAL_REVIEW', label: 'Technical review' },
  { key: 3, value: 'PEER_REVIEW', label: 'Peer review' },
  { key: 4, value: 'DESIGN_REVIEW', label: 'Design review' },
  { key: 5, value: 'COPY_EDITING', label: 'Copy editing' },
  { key: 6, value: 'SOCIAL', label: 'Social' },
  { key: 7, value: 'PUBLISHED', label: 'Published' },
  { key: 8, value: 'ARCHIVED', label: 'Archived' },
]

export const articlePieChart = [
  { key: 0, value: 'DRAFT', label: 'Writing' },
  {
    key: 1,
    value: 'TECHNICAL_REVIEW',
    label: 'Technical review',
  },
  { key: 2, value: 'PEER_REVIEW', label: 'Peer review' },
  { key: 3, value: 'DESIGN_REVIEW', label: 'Design review' },
]

export const articleBarChart = [
  { key: 0, value: 'DRAFT', label: 'Writing' },
  {
    key: 1,
    value: 'TECHNICAL_REVIEW',
    label: 'Technical review',
  },
  { key: 2, value: 'PEER_REVIEW', label: 'Peer review' },
  { key: 3, value: 'DESIGN_REVIEW', label: 'Design review' },
  { key: 4, value: 'PUBLISHED', label: 'Published' },
]

export const articleSeriesKey = articleBarChart.map((item) => {
  return { dataKey: item.label, label: item.label, stack: 'unique' }
})
