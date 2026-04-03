import './FilterBar.css'

import { FilterAlt } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { FilterBarProps } from './interface'

import { useIsMobile } from '../../hooks/useIsMobile'
import { useFilterBarStore, useSearchStore } from '../../store'
import Button from '../Buttons/Button/Button'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Search from '../Search/Search'

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()
  const { setQuery: setSearch } = useSearchStore()
  const { isFilterOpen, resetFilters, resetSpecificFilter, setFilterOpen } = useFilterBarStore()

  const toggleMenu = () => {
    setFilterOpen(!isFilterOpen)
  }

  useIsMobile(setIsMobile)

  return (
    <div className={isFilterOpen ? 'filter-bar filters-bar-open' : 'filter-bar'}>
      <div className="search-bar-container">
        {' '}
        <Search placeholder={t('search.placeholder')} />
        {isMobile && (
          <FilterAlt sx={{ fontSize: 40 }} className="filter-button" onClick={toggleMenu} />
        )}
      </div>
      <div
        className={
          isFilterOpen
            ? 'filter-dropdown-container filters-open'
            : 'filter-dropdown-container filters-container'
        }
      >
        {filters.map((filter) => (
          <div className="filter-container" key={filter.name}>
            <span className="filter-label">{filter.label}</span>
            <DropdownMenu
              key={filter.name}
              name={filter.name}
              options={filter.options}
              value={filter.value}
              onChange={(value) =>
                onFilterChange(filter.name, value, searchParams, setSearchParams)
              }
              onReset={() => resetSpecificFilter(searchParams, setSearchParams, filter.name)}
            />
          </div>
        ))}{' '}
      </div>{' '}
      <Button
        text="close"
        className="clear-icon-button material-symbols-outlined"
        type="reset"
        variant="secondary"
        onClick={() => {
          setSearch('')
          resetFilters(searchParams, setSearchParams, filters)
        }}
        dataTestId="clear-mobile-button"
      ></Button>
      <Button
        text="Clear All"
        className="clear-all-button"
        type="reset"
        variant="secondary"
        onClick={() => {
          setSearch('')
          resetFilters(searchParams, setSearchParams, filters)
        }}
        dataTestId="clear-button"
      ></Button>
    </div>
  )
}

export default FilterBar
