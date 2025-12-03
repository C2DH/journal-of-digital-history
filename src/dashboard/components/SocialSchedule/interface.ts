export interface SocialScheduleProps {
  rowData: any
  action: string
  onClose: () => void
  onNotify: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

export type Frequency = { timeGap: string; timeUnit: string }
export type SocialMediaCampaign = {
  repository_url: string
  article_url: string
  schedule_main: string[]
}
