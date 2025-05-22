import { useEffect, useRef } from 'react'
import {
  DisplayLayerCellIdxQueryParam,
  DisplayLayerSectionBibliography,
  DisplayLayerSectionParam,
} from '../../constants/globalConstants'
import { NumberParam, useQueryParams, withDefault } from 'use-query-params'
import { useArticleStore } from '../../store'
import { asEnumParam } from '../../logic/params'

const ArticleScrollTo = () => {
  const selectedCellIdxFromStore = useArticleStore((state) => state.selectedCellIdx)
  const timerRef = useRef(null)
  const [
    { [DisplayLayerCellIdxQueryParam]: selectedCellIdx, [DisplayLayerSectionParam]: sectionName },
    setQuery,
  ] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerSectionParam]: asEnumParam([DisplayLayerSectionBibliography]),
  })
  const moveTo = (idx) => {
    // scroll to the correct id
    const element = document.querySelector("[data-cell-idx='" + idx + "']")

    if (element) {
      window.scrollTo(0, element.offsetTop - 150)
    }
  }
  useEffect(() => {
    if (selectedCellIdxFromStore !== -1 && selectedCellIdxFromStore !== selectedCellIdx) {
      moveTo(selectedCellIdxFromStore)
      setQuery({ [DisplayLayerCellIdxQueryParam]: selectedCellIdxFromStore })
    }
  }, [selectedCellIdxFromStore])

  useEffect(() => {
    console.debug(
      '[ArticleScrollTo] selectedCellIdx:',
      selectedCellIdx,
      'sectionName:',
      sectionName,
    )
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (sectionName) {
        moveTo(sectionName)
      } else if (selectedCellIdx !== -1) {
        moveTo(selectedCellIdx)
      }
    }, 1000)

    return () => clearTimeout(timerRef.current)
  }, [selectedCellIdx, sectionName])
}

export default ArticleScrollTo
