import { useState } from 'react'

import Checkbox from '../Checkbox/Checkbox'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { timeGapHour, timeGapMinute, timeUnits } from './constant'

const PostReplies = ({ frequency, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [timeUnit, setTimeUnit] = useState<string>('-')
  const [timeGap, setTimeGap] = useState<string>('-')

  const ActivatePostReplies = () => {
    setIsChecked(!isChecked)
  }
  const HandleFrequencySelection = (type: string, value: string) => {
    if (type === 'timeGap') {
      onChange({ ...frequency, timeGap: value.toString() })
      setTimeGap(value.toString())
    }
    if (type === 'timeUnit') {
      onChange({ ...frequency, timeUnit: value.toString() })
      setTimeUnit(value.toString())
    }
  }

  return (
    <span className="post-replies-container">
      <Checkbox checked={isChecked} onChange={ActivatePostReplies} isHeader={false} /> every{' '}
      <DropdownMenu
        name="time-gap"
        options={frequency.timeUnit === 'hours' ? timeGapHour : timeGapMinute}
        value={timeGap}
        onChange={(e) => HandleFrequencySelection('timeGap', e.toString().valueOf())}
        onReset={() => HandleFrequencySelection('timeGap', '-')}
        disable={!isChecked}
      />{' '}
      <DropdownMenu
        name="time-unit"
        options={timeUnits}
        value={timeUnit}
        onChange={(e) => HandleFrequencySelection('timeUnit', e.toString().valueOf())}
        onReset={() => HandleFrequencySelection('timeUnit', '-')}
        disable={!isChecked}
      />
    </span>
  )
}
export default PostReplies
