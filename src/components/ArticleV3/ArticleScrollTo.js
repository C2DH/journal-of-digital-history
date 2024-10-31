import { useEffect, useRef } from 'react'
import { DisplayLayerCellIdxQueryParam } from '../../constants'
import { NumberParam, useQueryParams, withDefault } from 'use-query-params'
import { useArticleStore } from '../../store'


const ArticleScrollTo = () => {
  const selectedCellIdxFromStore = useArticleStore(state => state.selectedCellIdx)
  const timerRef = useRef(null)
  const [{ [DisplayLayerCellIdxQueryParam]: selectedCellIdx }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
  })
  const moveTo = (idx) => {
     // scroll to the correct id
     const element = document.querySelector("[data-cell-idx='" + idx + "']")

     if (element) {
       window.scrollTo(0,element.offsetTop -150)
     }
  }
  useEffect(() => {
    if(selectedCellIdxFromStore !== -1 && selectedCellIdxFromStore !== selectedCellIdx) {
      moveTo(selectedCellIdxFromStore)
      setQuery({ [DisplayLayerCellIdxQueryParam]: selectedCellIdxFromStore })
    }
  }, [selectedCellIdxFromStore])

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      moveTo(selectedCellIdx)
    }, 1000)
    
    return () => clearTimeout(timerRef.current)
  }, [selectedCellIdx])
}

export default ArticleScrollTo