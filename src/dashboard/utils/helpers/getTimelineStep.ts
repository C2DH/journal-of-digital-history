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
      return { icon: 'check_circle', colorClass: 'timeline-done' }
    }
    if (idx === currentIdx) {
      return { icon: 'error', colorClass: 'timeline-pending' }
    }
    return { icon: 'radio_button_unchecked', colorClass: 'timeline-todo' }
  })
}

export { getTimelineSteps }
