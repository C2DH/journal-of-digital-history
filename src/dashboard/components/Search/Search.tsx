import './Search.css'

import React, { useEffect } from 'react'

import { SearchProps } from './interface'

import { useDebounce } from '../../../hooks/useDebounce'
import { useSearchStore } from '../../store'

const Search = ({ placeholder = 'Search' }: SearchProps) => {
  const query = useSearchStore((state) => state.query)
  const setSearch = useSearchStore((state) => state.setQuery)
  const debouncedValue = useDebounce(query, 300)

  useEffect(() => {
    setSearch(debouncedValue)
  }, [debouncedValue, setSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className={`search-bar`}>
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
