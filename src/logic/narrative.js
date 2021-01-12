export const getNarrativeProgress = ({
  steps=[], progress=0.0
}) => {
  const progressWeighted = progress * (steps.length + 1)
  const ratio = 1 / (steps.length + 1)
  const activeStep = Math.floor(progressWeighted)
  const stepProgress = ((progress - activeStep * ratio) / ratio)
  return {
    ratio,
    stepProgress,
    activeStep,
  }
}
