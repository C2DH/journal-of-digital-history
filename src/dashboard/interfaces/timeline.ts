export interface TimelineProps {
  steps: Step[]
  currentStatus: string
}

export type Step = {
  key: string
  label: string
}

export type StepVisual = {
  icon: string
  colorClass: string
}
