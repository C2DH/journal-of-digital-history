export interface SocialScheduleProps {
  rowData: any
  onClose: () => void
  onNotify?: (notification: {
    type: 'success' | 'error'
    message: string
    submessage?: string
  }) => void
}

export type Frequency = { timeGap: string; timeUnit: string }
