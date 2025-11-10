import './Deadline.css'

const Deadline = () => {
  return (
    <div className="deadline-counter">
      <span className="material-symbols-outlined deadline-logo"> campaign</span>
      <div className="deadline-counter-info">
        <span className="deadline-counter-cfp-title">AI & History </span>
        <span className="deadline-counter-days">64 days left</span>
        <p className="deadline-counter-dates"> 31 May 2025 - 31 Dec 2025</p>
      </div>
    </div>
  )
}

export default Deadline
