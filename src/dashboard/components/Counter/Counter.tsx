import './Counter.css'
import { CounterProps } from './interface'

const Counter = ({ value }: CounterProps) => <div className="counter-box">{value}</div>

export default Counter
