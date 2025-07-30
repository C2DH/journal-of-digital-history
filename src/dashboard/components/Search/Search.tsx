import './Search.css'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import { SearchProps } from './interface'

import { useDebounce } from '../../../hooks/useDebounce'

const Search = ({ placeholder = 'Search', onSearch, activeRoutes }: SearchProps) => {
  const location = useLocation()
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  if (activeRoutes && !activeRoutes.includes(location.pathname)) {
    return null
  }

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
