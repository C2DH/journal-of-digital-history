import './PieCenterLabel.css'

import { styled } from '@mui/material/styles'
import { useDrawingArea } from '@mui/x-charts/hooks'

interface PieCenterLabelProps {
  total: React.ReactNode
  children: React.ReactNode
}

const StyledText = styled('text')(() => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
}))

const PieCenterLabel = ({ total, children: text }: PieCenterLabelProps) => {
  const { width, height, left, top } = useDrawingArea()
  return (
    <>
      {' '}
      <StyledText
        className={'pie-chart-center-label number'}
        x={left + width / 2}
        y={top + height / 2.3}
      >
        {total}
      </StyledText>
      <StyledText
        className={'pie-chart-center-label text'}
        x={left + width / 2}
        y={top + height / 1.8}
      >
        {text}
      </StyledText>
    </>
  )
}

export default PieCenterLabel
