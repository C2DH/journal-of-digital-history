import React, { useEffect } from 'react'
import { LayerNarrative } from '../../constants'
import ArticleCell from '../Article/ArticleCell'
import ArticleCellObserver from './ArticleCellObserver'
import ArticleCellPlaceholder from './ArticleCellPlaceholder'
import ArticleCellPopup from './ArticleCellPopup'
import { a, useSpring, config } from 'react-spring'
import { useRefWithCallback } from '../../hooks/graphics'
import { Button } from 'react-bootstrap'
import { ArrowRight, ArrowLeft } from 'react-feather'
import {
  DisplayLayerSectionBibliography,
  DisplayLayerSectionFooter,
  IsMobile,
} from '../../constants'
import '../../styles/components/Article2/ArticleLayer.scss'

function getCellAnchorFromIdx(idx, prefix = 'c') {
  return `${prefix}${idx}`
}

function layerTransition(x, y, width, height) {
  return `polygon(${x}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleLayer = ({
  memoid = '',
  layer = LayerNarrative,
  // previousLayer=null,
  // nextLayer=null,
  paragraphsGroups = [],
  paragraphs = [],
  // index of selected cell  (cell.idx)
  selectedCellIdx = -1,
  selectedCellTop = 0,
  selectedLayerHeight = -1,
  onDataHrefClick,
  onCellPlaceholderClick,
  onCellIntersectionChange,
  onAnchorClick,
  isSelected = false,
  selectedLayer = '',
  previousLayer = '',
  selectedSection = null,
  previousCellIdx = -1,
  layers = [],
  children,
  width = 0,
  height = 0,
  isJavascriptTrusted = false,
  style,
  // if it is defined, will override the style of the
  // ArticleLayout pushFixed header
  pageBackgroundColor,
  renderedBibliographyComponent = null,
  renderedFooterComponent = null,
  renderedLogoComponent = null,
}) => {
  const [popupProps, setPopupProps] = useSpring(() => ({
    x: 0,
    y: 0,
    opacity: 0,
    cellIdx: -1,
    cellLayer: '',
    config: config.stiff,
  }))
  const [mask, setMask] = useSpring(() => ({
    clipPath: [width, 0, width, height],
    x: 0,
    y: 0,
    config: config.slow,
  }))
  const layerRef = useRefWithCallback((layerDiv) => {
    if (selectedSection) {
      console.info(
        '[ArticleLayer] @useRefWithCallback on selectedSection selected:',
        selectedSection,
      )
      // get section offset
      const sectionElement = document.getElementById(getCellAnchorFromIdx(selectedSection, layer))
      if (!sectionElement) {
        console.warn(
          '[ArticleLayer] @useRefWithCallback could not find any sectionElement with given id:',
          selectedSection,
        )
        return
      }
      layerDiv.scrollTo({
        top: sectionElement.offsetTop + layerDiv.offsetTop - 150,
        behavior: previousLayer === selectedLayer ? 'smooth' : 'instant',
      })
      return
    } else if (!isSelected || selectedCellIdx === -1) {
      // discard
      return
    }
    // get cellEmeemnt in current layer (as it can be just a placeholder,too)
    const cellElement = document.getElementById(getCellAnchorFromIdx(selectedCellIdx, layer))
    if (!cellElement) {
      console.warn('Not found! celleElment with given id:', selectedCellIdx)
      return
    }
    // if the current layer height is greater than the height ref in the URL params,
    // it means we can safely scroll to the selectedcellTop position displayed in the URL.
    const cellElementRefTop =
      height >= selectedLayerHeight ? selectedCellTop : selectedLayerHeight / 2
    const top = cellElement.offsetTop + layerDiv.offsetTop - cellElementRefTop
    console.debug(
      '[ArticleLayer] useRefWithCallback',
      '\n selectedCellIdx:',
      selectedCellIdx,
      '\n layer',
      layer,
      '\n scrollTo:',
      top,
    )
    setTimeout(() => {
      const top = cellElement.offsetTop + layerDiv.offsetTop - cellElementRefTop

      layerDiv.scrollTo({
        top,
        behavior: !previousLayer || previousLayer === selectedLayer ? 'smooth' : 'instant',
      })
    }, 10)
    // layerDiv.scrollTo({
    //   top,
    //   behavior: !previousLayer || previousLayer === selectedLayer ? 'smooth' : 'instant',
    // })
    // cellElement.scrollIntoView()
  })

  const onCellPlaceholderClickHandler = (e, cell) => {
    if (typeof onCellPlaceholderClick === 'function') {
      const wrapper = e.currentTarget.closest('.ArticleLayer_placeholderWrapper')
      onAnchorClick(e, {
        layer: cell.layer,
        idx: cell.idx,
        previousIdx: cell.idx,
        previousLayer: layer,
        height, // ref height
        y: wrapper.offsetTop - wrapper.parentNode.scrollTop - 15,
      })
    } else {
      console.warn('[ArticleLayer] misses a onCellPlaceholderClick listener')
    }
  }

  /**
   * method onSelectedCellClickHandler
   * This method send user back to the placeholder who generated the link, if any.
   */
  const onSelectedCellClickHandler = (e, cell) => {
    // console.info('@onCellPlaceholderClickHandler', e, cell)
    // // eslint-disable-next-line
    // debugger

    if (typeof onCellPlaceholderClick === 'function') {
      onCellPlaceholderClick(e, {
        layer: previousLayer,
        idx: previousCellIdx > -1 ? previousCellIdx : cell.idx,
        height, // ref height
        y:
          previousCellIdx > -1
            ? selectedCellTop
            : e.currentTarget.parentNode.parentNode.offsetTop -
              e.currentTarget.parentNode.parentNode.parentNode.scrollTop -
              15,
      })
    }
  }

  /**
   * method onNumClickHandler
   * update the Animatable properties of ArticleCellPopup component. We add there also
   * the current cell idx and cell layer (yes, it should be better placed in a ref @todo)
   */
  const onNumClickHandler = (e, cell) => {
    const wrapper = e.currentTarget.closest('.ArticleLayer_paragraphWrapper')
    setPopupProps.start({
      from: {
        x: e.currentTarget.parentNode.offsetLeft,
        y: wrapper.offsetTop,
        opacity: 0.6,
        cellIdx: cell.idx,
        cellLayer: cell.layer,
      },
      to: {
        x: e.currentTarget.parentNode.offsetLeft,
        y: wrapper.offsetTop - 10,
        opacity: 1,
        cellIdx: cell.idx,
        cellLayer: cell.layer,
      },
    })
    onAnchorClick(e, {
      layer: cell.layer,
      idx: cell.idx,
      previousLayer: cell.layer,
      previousIdx: cell.idx,
      height, // ref height
      y: wrapper.offsetTop - wrapper.parentNode.scrollTop - 15,
    })
  }

  const onCellPlaceholderNumClickHandler = (e, cell) => {
    const wrapper = e.currentTarget.closest('.ArticleLayer_placeholderWrapper')

    console.debug('[ArticleLayer] @onCellPlaceholderNumClickHandler', cell)
    onAnchorClick(e, {
      idx: cell.idx,
      layer: cell.layer,
      height, // ref height
      y: wrapper.offsetTop - wrapper.parentNode.scrollTop - 15,
      previousLayer: selectedLayer,
      previousIdx: cell.idx,
    })
  }

  const onCellPopupClickHandler = (e, cell) => {
    console.debug('[ArticleLayer] @onCellPopupClickHandler', cell)
    onCellPlaceholderClick(e, {
      layer: cell.layer,
      idx: cell.idx,
      height, // ref height
      y: 100,
    })
  }

  const onLayerClickHandler = (e) => {
    // console.debug('[ArticleLayer] @onLayerClickHandler', e)
    // // eslint-disable-next-line
    // debugger
    // check if the user clicked on an anchor element (figure, table of simple anchor)
    // in the markdown cell content.
    if (e.target.nodeName === 'A') {
      if (e.target.hasAttribute('data-href')) {
        // link to bibliography :)
        const dataHref = e.target.getAttribute('data-href')
        onDataHrefClick({ dataHref })
      } else if (e.target.hasAttribute('data-idx')) {
        e.preventDefault()
        const targetCellIdx = parseInt(e.target.getAttribute('data-idx'), 10)
        const targetCell = paragraphs.find((p) => p.idx === targetCellIdx)
        const cellElement = document.getElementById(
          getCellAnchorFromIdx(targetCellIdx, targetCell.layer),
        )
        if (!cellElement) {
          console.warn('Not found! celleElment with given id:', selectedCellIdx)
          return
        }
        // get cell idx where the event was generated.
        const wrapper = e.target.closest('.ArticleLayer_paragraphWrapper')
        if (!wrapper) {
          // nothing to do :(
          console.warn(
            'ArticleLayer_paragraphWrapper Not found! Element is maybe a placeholder.',
            selectedCellIdx,
          )
          return
        }
        const sourceCellidx = parseInt(wrapper.getAttribute('data-cell-idx'), 10)
        const sourceCellLayer = wrapper.getAttribute('data-cell-layer')
        console.debug(
          '[ArticleLayer] @onLayerClickHandler:',
          '\n - target:',
          targetCellIdx,
          targetCell.layer,
          '\n - source:',
          sourceCellidx,
          sourceCellLayer,
        )
        onAnchorClick(e, {
          layer: targetCell.layer,
          idx: targetCell.idx,
          previousIdx: sourceCellidx,
          previousLayer: sourceCellLayer,
          height, // ref height
          y: wrapper.offsetTop - wrapper.parentNode.scrollTop - 15,
        })
      }
    } else {
      onDataHrefClick({})
    }

    if (!e.target.classList.contains('ArticleCellContent_num')) {
      setPopupProps.start({
        opacity: 0,
      })
    }
  }

  useEffect(() => {
    const layerLevel = layers.indexOf(layer)
    if (layerLevel === 0) {
      setMask.set({ clipPath: [0, 0, width, height], x: -width, y: 0 })
    } else if (layerLevel <= layers.indexOf(selectedLayer)) {
      console.debug(
        '[ArticleLayer] @useEffect open',
        layer,
        layers.indexOf(selectedLayer),
        layerLevel,
      )
      setMask.start({ clipPath: [0, 0, width, height], x: -width, y: 0 })
    } else if (layerLevel > layers.indexOf(selectedLayer)) {
      console.debug(
        '[ArticleLayer] @useEffect close',
        layer,
        layers.indexOf(selectedLayer),
        layerLevel,
      )
      setMask.start({ clipPath: [width, 0, width, height], x: 0, y: 0 })
    }
  }, [isSelected, layer, layers])

  console.debug(
    '[ArticleLayer] rendered: ',
    layer,
    '- n. groups:',
    paragraphsGroups.length + '\n memoid:',
    memoid,
  )

  return (
    <a.div
      ref={layerRef}
      className={`text-old-${layer} ArticleLayer_mask ${layer}`}
      style={{
        ...style,
        clipPath: mask.clipPath.to(layerTransition),
      }}
      onClick={onLayerClickHandler}
    >
      <div
        className={`ArticleLayer_pushFixed ${layer}`}
        style={{
          backgroundColor: pageBackgroundColor,
          height: IsMobile ? 0 : 100,
        }}
      ></div>
      <ArticleCellPopup style={popupProps} onClick={onCellPopupClickHandler} />
      {renderedLogoComponent}

      {children}

      {paragraphsGroups.map((paragraphsIndices, i) => {
        const firstCellInGroup = paragraphs[paragraphsIndices[0]]
        const isPlaceholder = firstCellInGroup.layer !== layer
        if (isPlaceholder) {
          return (
            <React.Fragment key={['pl', memoid, i].join('-')}>
              {paragraphsIndices.map((k) => (
                <a
                  key={['a', k].join('-')}
                  className="ArticleLayer_anchor"
                  id={getCellAnchorFromIdx(paragraphs[k].idx, layer)}
                ></a>
              ))}
              <div
                className={`ArticleLayer_placeholderWrapper position-relative ArticleLayer_placeholder ${layer}_${firstCellInGroup.layer}`}
              >
                <div
                  className={`ArticleLayer_placeholderActive ${layer} ${
                    firstCellInGroup.idx === selectedCellIdx ? 'on' : 'off'
                  }`}
                />
                {paragraphsIndices.slice(0, 2).map((j) => (
                  <ArticleCellObserver
                    onCellIntersectionChange={onCellIntersectionChange}
                    cell={paragraphs[j]}
                    key={['pl', memoid, i, j].join('-')}
                    className="ArticleStream_paragraph"
                  >
                    <ArticleCellPlaceholder
                      onNumClick={onCellPlaceholderNumClickHandler}
                      memoid={['pl', memoid, i, j].join('-')}
                      {...paragraphs[j]}
                      headingLevel={paragraphs[j].isHeading ? paragraphs[j].heading.level : 0}
                      nums={
                        firstCellInGroup.idx !== paragraphs[j].idx
                          ? []
                          : paragraphsIndices.map((d) => paragraphs[d].num)
                      }
                    />
                  </ArticleCellObserver>
                ))}
                <div
                  className={`ArticleLayer_placeholderGradient ${layer}_${firstCellInGroup.layer}`}
                />
                <div className="ArticleLayer_placeholderButton">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={(e) => onCellPlaceholderClickHandler(e, firstCellInGroup)}
                  >
                    read in {firstCellInGroup.layer} layer &nbsp;
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={[memoid, i].join('-')}>
            {paragraphsIndices.map((j) => {
              const cell = paragraphs[j]
              if (!cell) {
                // eslint-disable-next-line
                debugger
              }
              return (
                <React.Fragment key={[memoid, i, j].join('-')}>
                  <a className="ArticleLayer_anchor" id={getCellAnchorFromIdx(cell.idx, layer)}></a>
                  <div
                    className="ArticleLayer_paragraphWrapper"
                    data-cell-idx={cell.idx}
                    data-cell-layer={cell.layer}
                  >
                    <div
                      className={`ArticleLayer_cellActive ${
                        firstCellInGroup.idx === selectedCellIdx || cell.idx === selectedCellIdx
                          ? 'on'
                          : 'off'
                      }`}
                    />
                    <ArticleCellObserver
                      onCellIntersectionChange={onCellIntersectionChange}
                      cell={cell}
                      className="ArticleStream_paragraph"
                    >
                      {cell.idx === selectedCellIdx &&
                        previousLayer !== '' &&
                        previousLayer !== layer && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="ArticleLayer_paragraphWrapper_backBtn"
                            onClick={(e) => onSelectedCellClickHandler(e, cell)}
                          >
                            <ArrowLeft size={16} /> back
                          </Button>
                        )}
                      <ArticleCell
                        isJavascriptTrusted={isJavascriptTrusted}
                        onNumClick={onNumClickHandler}
                        memoid={[memoid, i, j].join('-')}
                        {...cell}
                        num={cell.num}
                        idx={cell.idx}
                        role={cell.role}
                        layer={cell.layer}
                        headingLevel={cell.isHeading ? cell.heading.level : 0}
                        windowHeight={height}
                      />
                    </ArticleCellObserver>
                  </div>
                </React.Fragment>
              )
            })}
          </React.Fragment>
        )
      })}
      <div className="ArticleLayer_push"></div>
      <a
        className="ArticleLayer_anchor"
        id={getCellAnchorFromIdx(DisplayLayerSectionBibliography, layer)}
      ></a>
      {renderedBibliographyComponent}
      <div className="my-5" />
      <a
        className="ArticleLayer_anchor"
        id={getCellAnchorFromIdx(DisplayLayerSectionFooter, layer)}
      ></a>
      {renderedFooterComponent}
    </a.div>
  )
}

export default ArticleLayer
