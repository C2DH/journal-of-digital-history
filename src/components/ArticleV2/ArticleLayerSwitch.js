import React, { useEffect } from 'react'
import { useQueryParams, StringParam, withDefault } from 'use-query-params'
import { DisplayLayerQueryParam, LayerNarrative } from '../../constants/globalConstants'
import '../../styles/components/Article2/ArticleLayerSwitch.scss'
import { useTranslation } from 'react-i18next'

const ArticleLayerSwitch = ({ layers = [], className = '', onChange }) => {
  const { t } = useTranslation()
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
      {layers.map((d, i) => {
        const label = t(`actions.switchLayer.${d}`)
        return (
          <button
            key={i}
            className={['btn btn-sm btn-outline-secondary', layer === d ? 'active' : ''].join(' ')}
            onClick={() =>
              setQuery({
                [DisplayLayerQueryParam]: d,
              })
            }
            title={label}
            aria-label={label}
          >
            {d}
          </button>
        )
      })}
    </div>
  )
}

export default ArticleLayerSwitch
