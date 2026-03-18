import { CheckCircle, Error, RadioButtonUncheckedRounded } from '@mui/icons-material'

import { Step, StepVisual } from '../../components/Timeline/interface'

/**
 * Generates an array of all the steps with their icon for each of them.
 *
 * @param currentStatus - The key of the current step in the timeline.
 * @param steps - An array of all possible steps in the timeline.
 * @returns An array of objects representing the visual state of each step, including icon and color class.
 */
function getTimelineSteps(currentStatus: string, steps: Step[]): StepVisual[] {
  const currentIdx = steps.findIndex((step) => step.key === currentStatus.toLowerCase())

  return steps.map((step, idx) => {
    if (idx < currentIdx) {
      return { icon: <CheckCircle />, colorClass: 'timeline-done' }
    }
    if (idx === currentIdx) {
      return { icon: <Error />, colorClass: 'timeline-pending' }
    }
    return { icon: <RadioButtonUncheckedRounded />, colorClass: 'timeline-todo' }
  })
}

export { getTimelineSteps }
