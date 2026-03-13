export interface SocialScheduleProps {
  rowData: any
  action: string
  onClose: () => void
}

export type Frequency = { timeGap: string; timeUnit: string }
export type SocialMediaCampaign = {
  repository_url: string
  article_url: string
  schedule_main: string[]
}
