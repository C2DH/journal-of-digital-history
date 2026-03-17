export interface TimelineProps {
  steps: Step[]
  currentStatus: string
}

export type Step = {
  key: string
  label: string
}

export type StepVisual = {
  icon: React.ReactNode
  colorClass: string
}
