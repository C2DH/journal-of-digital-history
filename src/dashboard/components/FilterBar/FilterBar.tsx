import './FilterBar.css'

import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { FilterBarProps } from './interface'

import { useFilterBarStore, useSearchStore } from '../../store'
import Button from '../Buttons/Button/Button'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Search from '../Search/Search'

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setQuery: setSearch } = useSearchStore()
  const { resetFilters, resetSpecificFilter } = useFilterBarStore()

  return (
    <div className="filter-bar">
      <Search placeholder={t('search.placeholder')} />
      {filters.map((filter) => (
        <div className="filter-container" key={filter.name}>
          <span className="filter-label">{filter.label}</span>
          <DropdownMenu
            key={filter.name}
            name={filter.name}
            options={filter.options}
            value={filter.value}
            onChange={(value) => onFilterChange(filter.name, value, searchParams, setSearchParams)}
            onReset={() => resetSpecificFilter(searchParams, setSearchParams, filter.name)}
          />
        </div>
      ))}
      <Button
        text="close"
        className="clear-icon-button material-symbols-outlined"
        type="reset"
        variant="secondary"
        onClick={() => {
          setSearch('')
          resetFilters(searchParams, setSearchParams, filters)
        }}
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
      ></Button>
    </div>
  )
}

export default FilterBar
