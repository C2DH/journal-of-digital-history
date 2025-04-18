import React from 'react'
import { ArrowDown, ArrowUp } from 'react-feather'

const Sorting = ({
  options=[],
  directions=[
    { label: <ArrowUp size={13}/>, value: 1 },
    { label: <ArrowDown size={13}/>, value: -1 }
  ],
  currentOption,
  currentDirection,
  optionsLabel='',
  directionsLabel='',
  onChange,
  className='',
}) => {
  console.debug('[Sorting]', currentDirection, currentOption)
  return (
    <div className={`Sorting ${className}`}>
      <section>
        <label>{optionsLabel}</label>
        <ul className="Sorting_options">
          {options.map((option, i) => (
            <li
              key={i}
              className={option.value === currentOption? 'active' : ''}
              onClick={() => onChange({
                option,
                direction: directions.find(d => d.value === currentDirection)
              })}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <label>{directionsLabel}</label>
        <ul className="Sorting_directions">
          {directions.map((direction, i) => (
            <li
              key={i}
              className={direction.value === currentDirection? 'active' : ''}
              onClick={() => onChange({
                option: options.find(d => d.value === currentOption),
                direction
              })}
            >
              {direction.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Sorting
