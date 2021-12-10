import React, { useEffect } from 'react'
import { LayerNarrative } from '../../constants'
import ArticleCell from '../Article/ArticleCell'
import ArticleCellObserver from './ArticleCellObserver'
import ArticleCellPlaceholder from './ArticleCellPlaceholder'
import {a, useSpring, config} from 'react-spring'
import { useRefWithCallback } from '../../hooks/graphics'
import { Button } from 'react-bootstrap'
import { ArrowRight, ArrowLeft, Bookmark } from 'react-feather'
import styles from './ArticleLayer.module.css'

function getCellAnchorFromIdx(idx, prefix='c') {
  return `${prefix}${idx}`
}

function layerTransition(x, y, width, height) {
  return `polygon(${x}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

function cx(...rest) {
  return styles[rest.join('_')]
}

const ArticleLayer = ({
  memoid='',
  layer=LayerNarrative,
  // previousLayer=null,
  // nextLayer=null,
  paragraphsGroups=[],
  paragraphs=[],
  // index of selected cell  (cell.idx)
  selectedCellIdx=-1,
  selectedCellTop=0,
  onCellPlaceholderClick,
  onCellIntersectionChange,
  isSelected=false,
  selectedLayer='',
  previousLayer='',
  layers=[],
  children,
  width=0, height=0,
  style,
  FooterComponent = function({ width, height }) { return <div style={{width, height}} />},
}) => {
  const [mask, setMask] = useSpring(() => ({
    clipPath: [width, 0, width, height], x:0, y:0,
    config: config.slow
  }))
  const layerRef = useRefWithCallback((layerDiv) => {
    if (!isSelected || selectedCellIdx === -1) { // discard
      return
    }
    // get cellEmeemnt in current layer (as it can be just a placeholder,too)
    const cellElement = document.getElementById(getCellAnchorFromIdx(selectedCellIdx, layer))
    if (!cellElement) {
      console.warn('Not found! celleElment with given id:', selectedCellIdx)
      return
    }
    console.debug('[ArticleLayer] useRefWithCallback:', selectedCellIdx, layer, 'selectedCellTop', selectedCellTop, cellElement.offsetTop, getCellAnchorFromIdx(selectedCellIdx, layer))
    layerDiv.scrollTo({ top: cellElement.offsetTop + layerDiv.offsetTop - selectedCellTop })
  })

  const onCellPlaceholderClickHandler = (e, cell) => {
    if (typeof onCellPlaceholderClick === 'function') {
      onCellPlaceholderClick(e, {
        layer: cell.layer,
        idx: cell.idx,
        height, // ref height
        y: e.currentTarget.parentNode.parentNode.getBoundingClientRect().y -15
      })
    } else {
      console.warn('[ArticleLayer] misses a onCellPlaceholderClick listener')
    }
  }

  const onSelectedCellClickHandler = (e, cell) => {
    if (typeof onCellPlaceholderClick === 'function') {
      onCellPlaceholderClick(e, {
        layer: previousLayer,
        idx: cell.idx,
        height, // ref height
        y: e.currentTarget.parentNode.getBoundingClientRect().y -15
      })
    }
  }

  useEffect(() => {
    if (layers.indexOf(layer) <= layers.indexOf(selectedLayer)) {
      console.info('open', layer, layers.indexOf(selectedLayer), layers.indexOf(layer))
      setMask.start({ clipPath: [0, 0, width, height], x:-width, y:0 })
    } else if (layers.indexOf(layer) > layers.indexOf(selectedLayer)) {
      console.info('close', layer, layers.indexOf(selectedLayer), layers.indexOf(layer))
      setMask.start({ clipPath: [width, 0, width, height], x:0, y:0 })
    }
  }, [isSelected, layer, layers])

  console.debug('[ArticleLayer] rendered: ',layer,'- n. groups:', paragraphsGroups.length)

  return (
    <a.div ref={layerRef} className={`text-old-${layer} ${cx('mask', layer)}`} style={{
      ...style,
      clipPath: mask.clipPath.to(layerTransition),
    }} >
      <div className={cx('pushFixed', layer)}></div>
      <div className={styles.push}></div>
      {children}
      {paragraphsGroups.map((paragraphsIndices, i) => {
        const firstCellInGroup = paragraphs[paragraphsIndices[0]]
        const isPlaceholder = firstCellInGroup.layer !== layer
        if (isPlaceholder) {
          return (
            <React.Fragment key={i}>
              {paragraphsIndices.map((k) => (
                <a key={['a', k].join('-')} className={styles.anchor} id={getCellAnchorFromIdx(paragraphs[k].idx, layer)}></a>
              ))}
              <div className={`position-relative ArticleStream_paragraph ${cx('placeholder', layer, firstCellInGroup.layer)}`}>
                {paragraphsIndices.slice(0,2).map((j) => (
                  <ArticleCellObserver
                    onCellIntersectionChange={onCellIntersectionChange}
                    cell={paragraphs[j]}
                    key={[i,j].join('-')}
                    className=""
                  >
                    <ArticleCellPlaceholder
                      memoid={memoid}
                      {...paragraphs[j]}
                      headingLevel={paragraphs[j].isHeading ? paragraphs[j].heading.level : 0}
                    />
                  </ArticleCellObserver>
                ))}
                <div className={cx('placeholderGradient', layer, firstCellInGroup.layer)} />
                <div className={cx('placeholderActive', layer, firstCellInGroup.idx === selectedCellIdx ? 'on' : 'off' )}>
                  <Bookmark size={14}/>
                </div>
                <div className={styles.placeholderButton}>
                  <Button variant="outline-secondary" size="sm" className="d-flex align-items-center" onClick={(e) => onCellPlaceholderClickHandler(e, firstCellInGroup)}>
                    read in {firstCellInGroup.layer} layer
                    &nbsp;
                    <ArrowRight size={12}/>
                  </Button>
                </div>
            </div>
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={i}>
          {paragraphsIndices.map((j) => {
            const cell = paragraphs[j]
            if(!cell) {
              // eslint-disable-next-line
              debugger
            }
            return (
              <React.Fragment key={[i,j].join('-')}>
                <a className='ArticleLayer_anchor' id={getCellAnchorFromIdx(cell.idx,layer)}></a>
                <ArticleCellObserver
                  onCellIntersectionChange={onCellIntersectionChange}
                  cell={cell}
                  className="position-relative ArticleStream_paragraph"
                >
                  <div className={cx('cellActive', cell.idx === selectedCellIdx ? 'on' : 'off' )}>
                  <Bookmark size={14}/>
                  </div>
                  { cell.idx === selectedCellIdx && previousLayer !== '' && previousLayer !== layer ? (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className={styles.cellActiveBackButton}
                      onClick={(e) => onSelectedCellClickHandler(e, cell)}
                    >
                      <ArrowLeft size={16} /> back to [{previousLayer}]
                    </Button>
                  ) : null}
                  {/* debug && selectedCellIdx === cell.idx && previousLayer ? (
                    <div className="position-absolute left-0">
                      <button onClick={(e) => onOtherLayerCellClickHandler(e, cell, previousLayer) }>back to the other layer</button>
                    </div>
                  ):null */}
                  {/* debug && selectedCellIdx === cell.idx && nextLayer ? (
                    <div className="position-absolute right-0">
                      <button onClick={(e) => onOtherLayerCellClickHandler(e, cell, nextLayer) }>go to the next layer</button>
                    </div>
                  ):null */}
                  <ArticleCell
                    memoid={memoid}
                    {...cell}
                    num={cell.num}
                    idx={cell.idx}
                    role={cell.role}
                    headingLevel={cell.isHeading ? cell.heading.level : 0}
                  />
                </ArticleCellObserver>
              </React.Fragment>
            )
          })}
          </React.Fragment>
        )
      })}
      <div className={styles.push}></div>
      <FooterComponent width={width} height={height}/>
    </a.div>
  )
}

export default ArticleLayer
