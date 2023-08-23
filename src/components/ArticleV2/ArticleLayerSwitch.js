import React, { useEffect } from 'react'
import { useQueryParams, StringParam, NumberParam, withDefault } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  DisplayLayerNarrative,
  DisplayLayerCellIdxQueryParam,
} from '../../constants'

const ArticleLayerSwitch = ({ layers = [], className = '', onChange }) => {
  const [{ [DisplayLayerQueryParam]: layer }, setQuery] = useQueryParams({
    // [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, 0),
    [DisplayLayerQueryParam]: withDefault(StringParam, DisplayLayerNarrative),
  })
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(layer)
    }
  }, [layer])

  return (
    <>
      {layers.map((d, i) => (
        <div
          key={i}
          className={[className, layer === d ? 'active' : ''].join('')}
          onClick={() =>
            setQuery({
              [DisplayLayerQueryParam]: d,
            })
          }
        >
          {d}
        </div>
      ))}
    </>
  )
}

export default ArticleLayerSwitch
