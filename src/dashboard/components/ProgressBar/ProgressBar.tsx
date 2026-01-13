import './ProgressBar.css'

const ProgressBar = ({ days }: { days: number }) => {
  let color: string = 'green'
  if (days <= 30 && days > -30) {
    color = 'orange'
  } else if (days < -30) {
    color = 'red'
  }

  return (
    <div className="progress-bar-container" data-testid="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div className={`progress-bar-fill ${color}`} data-testid="progress-bar-fill"></div>
        {color != 'red' && <div className="trailing-line"></div>}
        {color != 'red' && <div className="trailing-triangle">◀</div>}
      </div>

      <div data-testid="days-left"> {Math.abs(days)} days left</div>
    </div>
  )
}

export default ProgressBar
