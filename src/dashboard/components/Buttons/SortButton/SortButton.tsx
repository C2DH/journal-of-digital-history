import { ArrowDown } from 'iconoir-react'
import { memo } from 'react'
import './SortButton.css'

import { SortButtonProps } from './interface'

const SortButton = ({ active, order, onClick, label }: SortButtonProps) => (
  <button
    type="button"
    className={`sort-btn${active ? ' active' : ''}`}
    onClick={onClick}
    aria-label={`Sort by ${label}`}
  >
    {label}
    <ArrowDown
      className="sort-arrow"
      style={{
        transform: active ? (order === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)') : 'rotate(0deg)',
        opacity: active ? 1 : 0.4,
      }}
      width={16}
      height={16}
      aria-label={active ? (order === 'asc' ? 'Ascending' : 'Descending') : 'Unsorted'}
    />
  </button>
)

export default memo(SortButton)
