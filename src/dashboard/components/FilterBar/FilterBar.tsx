import './FilterBar.css'

import { useTranslation } from 'react-i18next'

import { useSearchStore } from '../../store'
import Button from '../Buttons/Button/Button'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Search from '../Search/Search'

const FilterBar = ({ filters, onFilterChange }) => {
  const { t } = useTranslation()
  const setSearch = useSearchStore((state) => state.setQuery)

  return (
    <div className="filter-bar">
      <Search
        onSearch={setSearch}
        activeRoutes={['/abstracts', '/articles']}
        placeholder={t('search.placeholder')}
      />
      {filters.map((filter) => (
        <DropdownMenu
          key={filter.name}
          options={filter.options}
          value={filter.value}
          onChange={(value) => onFilterChange(filter.name, value)}
        />
      ))}
      <Button type={'submit'} text="Go →"></Button>
    </div>
  )
}

export default FilterBar
