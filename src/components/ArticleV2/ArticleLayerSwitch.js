import React, { useEffect } from 'react'
import { useQueryParams, StringParam, withDefault } from 'use-query-params'
import { DisplayLayerQueryParam, LayerNarrative } from '../../constants'
import '../../styles/components/Article2/ArticleLayerSwitch.scss'

const ArticleLayerSwitch = ({ layers = [], className = '', onChange }) => {
  const [{ [DisplayLayerQueryParam]: layer }, setQuery] = useQueryParams({
    // [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, 0),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
  })
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(layer)
    }
  }, [layer])

  return (
    <div className={`ArticleLayerSwitch btn-group ${className}`}>
      {layers.map((d, i) => (
        <button
          key={i}
          className={['btn btn-sm btn-outline-secondary', layer === d ? 'active' : ''].join(' ')}
          onClick={() =>
            setQuery({
              [DisplayLayerQueryParam]: d,
            })
          }
        >
          {d}
        </button>
      ))}
    </div>
  )
}

export default ArticleLayerSwitch
