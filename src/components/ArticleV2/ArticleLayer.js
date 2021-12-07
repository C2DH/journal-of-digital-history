import React, { useEffect } from 'react'
import { LayerNarrative } from '../../constants'
import ArticleCell from '../Article/ArticleCell'
import {a, useSpring, config} from 'react-spring'

function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = React.useRef(null);

  const setRef = React.useCallback(node => {
    if (nodeRef.current && typeof onUnmount === 'function') {
      onUnmount(nodeRef.current);
    }

    nodeRef.current = node;

    if (nodeRef.current && typeof onMount === 'function') {
      onMount(nodeRef.current);
    }
  }, [onMount, onUnmount]);

  return setRef;
}

function getCellAnchorFromIdx(idx, prefix='c') {
  return `${prefix}${idx}`
}

function layerTransition(x, y, width, height) {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleLayer = ({
  memoid='',
  layer=LayerNarrative,
  previousLayer=null,
  nextLayer=null,
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
    clipPath: [width, 50, width, height], x:0, y:0,
    config: config.molasses
  }))//, config: { mass: 1, tension: 50, friction: 10 } }))
  // if layer is selected and there is a cell to focus
  const layerRef = useRefWithCallback((layerDiv) => {
    if(!isSelected || selectedCellIdx === -1) { // discard
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
    // cellElement.offsetTop
    //   console.info('[ArticleLayer] ',layer,'goto cell: useRefWithCallback', layerDiv.scrollTop, selectedCellTop, cellElement)
    //   // eslint-disable-next-line
    //   debugger
    // }
  })

  const onPlaceholderClickHandler = (e, cell) => {
    if (typeof onPlaceholderClick === 'function') {
      onPlaceholderClick(e, {
        layer: cell.layer,
        idx: cell.idx,
        y: e.currentTarget.parentNode.getBoundingClientRect().y -15
      })
    } else {
      console.warn('[ArticleLayer] misses a onPlaceholderClick listener')
    }
  }

  const onOtherLayerCellClickHandler = (e, cell, otherlayer) => {
    if (typeof onPlaceholderClick === 'function') {
      onPlaceholderClick(e, {
        layer: otherlayer,
        idx: cell.idx,
        y: e.currentTarget.parentNode.getBoundingClientRect().y - 15
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
      setMask.start({ clipPath: [width, 50, width, height], x:0, y:0 })
    }
  }, [isSelected])

  console.debug('[ArticleLayer] rendered: ',layer,'- n. groups:', cellsGroups.length)
  return (
    <a.div ref={layerRef} className={`position-absolute bg-${layer}`} style={{
      ...style,
      // backgroundColor: layer === 'narrative' ? 'white' : layer === 'hermeneutics' ? 'green' : 'red',
      clipPath: mask.clipPath.to(layerTransition),
    }} >
      {children}
      {cellsGroups.map((cellsIndices, i) => {
        const firstCellInGroup = cells[cellsIndices[0]]
        const isPlaceholder = firstCellInGroup.layer !== layer
        if (isPlaceholder) {
          return (
            <React.Fragment key={i}>
            {cellsIndices.map((k) => (
              <a key={['a', k].join('-')} className='ArticleLayer_anchor' id={getCellAnchorFromIdx(cells[k].idx, layer)}></a>
            ))}
            <div
            className="position-relative"
              style={{
                color: 'green', maxHeight:200,
                overflow: 'hidden'}}

            >
              {cellsIndices.slice(0,2).map((j) => {
                const cell = cells[j]
                if(!cell) {
                  // eslint-disable-next-line
                  debugger
                }
                return (
                  <React.Fragment key={[i,j].join('-')}>
                    <ArticleCell
                      memoid={memoid}
                      {...cell}
                      num={cell.num}
                      idx={cell.idx}
                      role={cell.role}
                      headingLevel={cell.isHeading ? cell.heading.level : 0}
                    />
                  </React.Fragment>
                )
              })}
              <div></div>
              <div className="position-absolute" style={{
                zIndex:1,
                bottom: 0,
                pointerEvents: 'none',
                left:0,
                right:0,
                top:'50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
              }}/>

              <button className="position-absolute" style={{
                left: '50%',
                width: 200,
                marginLeft: -100,
                bottom: 20,
                zIndex:2,
              }} onClick={(e) => onPlaceholderClickHandler(e, firstCellInGroup)}>
                More... ({cellsIndices.length} paragraphs)
              </button>
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
                <div className="position-relative">
                  {selectedCellIdx === cell.idx && previousLayer ? (
                    <div className="position-absolute left-0">
                      <button onClick={(e) => onOtherLayerCellClickHandler(e, cell, previousLayer) }>back to the other layer</button>
                    </div>
                  ):null}
                  {selectedCellIdx === cell.idx && nextLayer ? (
                    <div className="position-absolute right-0">
                      <button onClick={(e) => onOtherLayerCellClickHandler(e, cell, nextLayer) }>go to the next layer</button>
                    </div>
                  ):null}
                  <ArticleCell
                    memoid={memoid}
                    {...cell}
                    num={cell.num}
                    idx={cell.idx}
                    role={cell.role}
                    headingLevel={cell.isHeading ? cell.heading.level : 0}
                  />
                </div>
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
