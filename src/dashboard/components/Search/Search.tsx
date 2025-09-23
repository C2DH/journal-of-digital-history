import './Search.css'

import React, { useEffect } from 'react'

import { SearchProps } from './interface'

import { useDebounce } from '../../../hooks/useDebounce'
import { useSearchStore } from '../../store'

const Search = ({ placeholder = 'Search' }: SearchProps) => {
  const { query: input, setQuery: setSearch } = useSearchStore()

  const debouncedValue = useDebounce(input, 500)

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
          value={input}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
    </div>
  )
}

export default Search
