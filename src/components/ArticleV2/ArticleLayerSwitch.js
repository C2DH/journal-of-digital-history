import React, { useEffect } from 'react'
import { useQueryParams, StringParam, NumberParam, withDefault, } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  DisplayLayerNarrative,
  DisplayLayerCellIdxQueryParam
} from '../../constants'

const ArticleLayerSwitch = ({
  layers=[],
  onChange
}) => {
  const [{[DisplayLayerQueryParam]:layer}, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, 0),
    [DisplayLayerQueryParam]: withDefault(StringParam, DisplayLayerNarrative)
  })
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(layer)
    } else {
      console.warn('No onChange function detected, can\'t forward layer from useQueryParam', layer);
    }
  }, [layer])

  return (
    <>
    {layers.map((d,i) => (
      <div key={i} onClick={() =>setQuery({
        [DisplayLayerQueryParam]: d
      })}>{d}</div>
    ))}
    </>
  )
}

export default ArticleLayerSwitch
