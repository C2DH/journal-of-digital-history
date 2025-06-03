import React, { useState } from 'react'
import { useLocation } from 'react-router'

import './Search.css'

type SearchProps = {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  activeRoutes?: string[]
}

const Search = ({
  placeholder = 'Search',
  onSearch,
  className = '',
  activeRoutes,
}: SearchProps) => {
  const [query, setQuery] = useState('')
  const location = useLocation()

  //TODO: integrate the API search
  if (activeRoutes && !activeRoutes.some((route) => location.pathname.startsWith(route))) {
    return null
  }

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
