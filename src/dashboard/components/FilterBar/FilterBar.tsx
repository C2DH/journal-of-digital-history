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
        <DropdownMenu
          key={filter.name}
          options={filter.options}
          value={filter.value}
          onChange={(value) => onFilterChange(filter.name, value)}
        />
      ))}
      <Button text="Clear All" color="color-deep-blue" onClick={handleClearAll}></Button>
    </div>
  )
}

export default FilterBar
