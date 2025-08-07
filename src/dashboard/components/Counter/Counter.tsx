// src/dashboard/components/Counter/Counter.tsx
import './Counter.css'

type CounterProps = {
  value: number
}

const Counter = ({ value }: CounterProps) => <div className="counter-box">{value}</div>

export default Counter
