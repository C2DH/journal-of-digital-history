import { useEffect, useId, useState } from 'react'

import { useDebounce } from '../../../hooks/useDebounce'

interface AffiliationProps {
  index: number
  value: string
  onChange: (value: string) => void
  placeholder?: string
  loadingText?: string
}

const Affiliation = ({ index, value, onChange, placeholder }: AffiliationProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const datalistId = useId()
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (!debouncedValue) {
      setSuggestions([])
      return
    }
    const fetchRorSuggestions = async (query: string) => {
      try {
        const res = await fetch(
          `https://api.ror.org/organizations?query=${encodeURIComponent(query)}`,
        )
        const data = await res.json()
        setSuggestions(data.items || [])
      } catch {
        setSuggestions([])
      }
    }
    fetchRorSuggestions(debouncedValue)
  }, [debouncedValue])

  return (
    <div className="input-group-custom affiliation-autocomplete">
      <input
        type="text"
        className="my-1 form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        list={datalistId}
        data-test={`form-control-authors-affiliation-${index}`}
      />
      <datalist id={datalistId}>
        {suggestions.map((org: any) => (
          <option key={org.id} value={org.name} />
        ))}
      </datalist>
      <div className="empty-space"></div>
    </div>
  )
}

export default Affiliation
