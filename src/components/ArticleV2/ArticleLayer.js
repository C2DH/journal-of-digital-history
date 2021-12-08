import React, { useEffect } from 'react'
import { LayerNarrative } from '../../constants'
import ArticleCell from '../Article/ArticleCell'
import ArticleCellObserver from './ArticleCellObserver'
import ArticleCellPlaceholder from './ArticleCellPlaceholder'
import {a, useSpring, config} from 'react-spring'
import { useRefWithCallback } from '../../hooks/graphics'
import { Button } from 'react-bootstrap'
import { ArrowRight } from 'react-feather'
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
  cellsGroups=[],
  cells=[],
  // index of selected cell  (cell.idx)
  selectedCellIdx=-1,
  selectedCellTop=0,
  onPlaceholderClick,
  isSelected=false,
  selectedLayer='',
  layers=[],
  children,
  width=0, height=0,
  style,
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

  const onPlaceholderClickHandler = (e, cell) => {
    if (typeof onPlaceholderClick === 'function') {
      onPlaceholderClick(e, {
        layer: cell.layer,
        idx: cell.idx,
        height, // ref height
        y: e.currentTarget.parentNode.parentNode.getBoundingClientRect().y -15
      })
    } else {
      console.warn('[ArticleLayer] misses a onPlaceholderClick listener')
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
  }, [isSelected])

  console.debug('[ArticleLayer] rendered: ',layer,'- n. groups:', cellsGroups.length)

  return (
    <a.div ref={layerRef} className={`text-old-${layer} ${cx('mask', layer)}`} style={{
      ...style,
      clipPath: mask.clipPath.to(layerTransition),
    }} >
      <div className={cx('pushFixed', layer)}></div>
      <div className={styles.push}></div>
      {children}
      {cellsGroups.map((cellsIndices, i) => {
        const firstCellInGroup = cells[cellsIndices[0]]
        const isPlaceholder = firstCellInGroup.layer !== layer
        if (isPlaceholder) {
          return (
            <React.Fragment key={i}>
              {cellsIndices.map((k) => (
                <a key={['a', k].join('-')} className={styles.anchor} id={getCellAnchorFromIdx(cells[k].idx, layer)}></a>
              ))}
              <div className={`position-relative ${cx('placeholder', layer, firstCellInGroup.layer)}`}>
                {cellsIndices.slice(0,2).map((j) => (
                  <React.Fragment key={[i,j].join('-')}>
                    <ArticleCellPlaceholder
                      memoid={memoid}
                      {...cells[j]}
                      headingLevel={cells[j].isHeading ? cells[j].heading.level : 0}
                    />
                  </React.Fragment>
                ))}
                <div className={cx('placeholderGradient', layer, firstCellInGroup.layer)} />
                <div className={cx('placeholderActive', firstCellInGroup.idx === selectedCellIdx ? 'on' : 'off' )}/>
                <div className={styles.placeholderButton}>
                  <Button variant="outline-secondary" size="sm" className="d-flex align-items-center" onClick={(e) => onPlaceholderClickHandler(e, firstCellInGroup)}>
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
          {cellsIndices.map((j) => {
            const cell = cells[j]
            if(!cell) {
              // eslint-disable-next-line
              debugger
            }
            return (
              <React.Fragment key={[i,j].join('-')}>
                <a className='ArticleLayer_anchor' id={getCellAnchorFromIdx(cell.idx,layer)}></a>
                <ArticleCellObserver cell={cell} className="position-relative">
                  <div className={cx('cellActive', firstCellInGroup.idx === selectedCellIdx ? 'on' : 'off' )}/>
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
    </a.div>
  )
}

export default ArticleLayer
