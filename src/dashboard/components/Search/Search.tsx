import './Search.css'

import React, { useEffect, useState } from 'react'

import { SearchProps } from './interface'

import { useDebounce } from '../../../hooks/useDebounce'

const Search = ({ placeholder = 'Search', onSearch }: SearchProps) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={`search-bar`}>
      <div className="search-input-frame">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
    </div>
  )
}

export default Search
