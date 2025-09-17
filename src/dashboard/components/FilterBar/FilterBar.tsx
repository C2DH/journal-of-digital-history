import './FilterBar.css'

import { useTranslation } from 'react-i18next'

import { FilterBarProps } from './interface'

import { useSearchStore } from '../../store'
import Button from '../Buttons/Button/Button'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Search from '../Search/Search'

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const { t } = useTranslation()
  const { setQuery: setSearch } = useSearchStore()

  const handleClearAll = () => {
    onFilterChange('callpaper', '')
    onFilterChange('issue', '')
    onFilterChange('status', '')
    setSearch('')
  }

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
            onChange={(value) => onFilterChange(filter.name, value)}
          />
        </div>
      ))}
      <Button text="Clear All" variant="secondary" onClick={handleClearAll}></Button>
    </div>
  )
}

export default FilterBar
