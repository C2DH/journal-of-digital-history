import React, { useState } from 'react'
import { useLocation } from 'react-router'

import { SearchProps } from './interface'

import './Search.css'

const Search = ({
  placeholder = 'Search',
  onSearch,
  className = '',
  activeRoutes,
}: SearchProps) => {
  const [query, setQuery] = useState('')
  const location = useLocation()

  //TODO: integrate the API search
  if (activeRoutes && !activeRoutes.includes(location.pathname)) {
    return null
  }

  // const { results, loading, error } = useSearch('/api/abstracts', query, USERNAME, PASSWORD)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-frame">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
    </div>
  )
}

export default Search
