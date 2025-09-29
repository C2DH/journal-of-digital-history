import './DropdownMenu.css'

import { XmarkCircle } from 'iconoir-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { DropdownMenuProps } from './interface'

import ArrowDownInCircle from '../../../assets/icons/ArrowDownInCircle'
import { useFilterBarStore } from '../../store'

const DropdownMenu = ({ name, options, value, onChange }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)
  const { resetSpecificFilter } = useFilterBarStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((opt) => opt.value === value)

  return (
    <div className="dropdown-menu custom-dropdown" ref={ref}>
      <div
        className="dropdown-selected"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
      >
        <span>{selected ? selected.label : ' - '}</span>
        {selected ? (
          <XmarkCircle
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              resetSpecificFilter(searchParams, setSearchParams, name)
            }}
          />
        ) : (
          <ArrowDownInCircle className="dropdown-icon" width="20px" />
        )}
      </div>
      {open && (
        <ul className="dropdown-list">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`dropdown-option ${opt.value === value ? 'selected' : ''}`}
              onMouseDown={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DropdownMenu
