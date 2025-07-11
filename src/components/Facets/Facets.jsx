import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import Dimension, { MethodFilter, MethodReplace, MethodRemove, MethodReset } from './Dimension'
import '../../styles/components/Facets.scss'

/**
 * Sort function for items based on a specified dimension.
 * Authors are classified using the Unicode system.
 * @param {Object} options - Sorting options.
 * @param {string} options.by - The dimension to sort by (default: 'authors').
 * @param {number} options.direction - Sorting direction (1 for ascending, -1 for descending).
 * @param {Array} options.dimensions - List of dimensions to sort by.
 * @returns {Function} - A comparator function for sorting.
 */
export function sortFn({ by = 'authors', direction = 1, dimensions = [] } = {}) {
  // Find the dimension to sort by
  const dimension = dimensions.find((d) => d.name === by)
  if (!dimension) return

  return (a, b) => {
    let aValue = dimension.fn(a)
    let bValue = dimension.fn(b)

    if (dimension.isArray) {
      aValue = aValue.join('')
      bValue = bValue.join('')
    }

    if (aValue && bValue) {
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue, 'en', { sensitivity: 'base' }) * direction
      }
      return aValue > bValue ? direction : -direction
    }

    if (aValue) return -direction
    if (bValue) return direction
    return 0
  }
}

/**
 * Hook useFacetsSelection
 * @return [{ selected, isActive, dims }]
 */
function useFacetsSelection(dimensions = []) {
  const [{ selected, isActive, dims }, setResult] = useState({
    selected: [],
    isActive: false,
    // resulting in { dim1: [], dim2: [], ... dimN: []}
    dims: dimensions.reduce((acc, d) => {
      acc[d.name] = {
        selected: [],
        keys: [],
        values: {},
      }
      return acc
    }, {}),
  })

  const changeSelection = ({ name = '', key = '', indices = [], method }) => {
    const _dims = { ...dims }
    const dimsKeys = Object.keys(dims)
    if (!dimsKeys.includes(name)) {
      console.error('[useFacetsSelection] {name} is not a valid dimension:', name)
      return
    }
    if (![MethodFilter, MethodReplace, MethodRemove, MethodReset].includes(method)) {
      console.error('[useFacetsSelection] {method} is not a valid dimension:', method)
      return
    }
    console.debug('[useFacetsSelection]', { name, key, indices, method })
    if (method === MethodFilter) {
      _dims[name].values[key] = indices
      if (_dims[name].selected.length) {
        _dims[name].selected = _dims[name].selected.filter((d) => indices.includes(d))
      } else {
        _dims[name].selected = indices
      }
      // this would be for MethodAdd
      // _dims[name].selected = _dims[name].selected
      //   // add indices
      //   .concat(indices)
      //   // remove dupes
      //   .filter((d, i, arr) => arr.indexOf(d) === i)
      if (!_dims[name].keys.includes(key)) {
        _dims[name].keys.push(key)
      }
    } else if (method === MethodRemove) {
      delete _dims[name].values[key]
      const keyToRemove = _dims[name].keys.indexOf(key)
      if (keyToRemove > -1) {
        _dims[name].keys.splice(keyToRemove, 1)
      }
      if (!_dims[name].keys.length) {
        _dims[name].selected = []
      } else {
        _dims[name].selected = Object.values(_dims[name].values).reduce((acc, values) => {
          if (!acc.length) {
            return values
          }
          return acc.filter((d) => !values.includes(d))
        }, [])
      }
    } else if (method === MethodReset) {
      _dims[name].selected = []
      _dims[name].keys = []
    } else if (method === MethodReplace) {
      _dims[name].selected = indices
      _dims[name].keys = [key]
    }

    setResult({
      // apply cascading, exclusive filters
      selected: dimsKeys.reduce((acc, k) => {
        if (_dims[k].selected.length === 0) {
          return acc
        }
        if (!acc.length) {
          // first array containing some items to start with.
          return _dims[k].selected
        }
        // do intersection between previous acc and current selection
        return acc.filter((d) => _dims[k].selected.includes(d))
      }, []),
      isActive: dimsKeys.reduce((acc, k) => {
        return acc || _dims[k].selected.length > 0
      }, false),
      dims: _dims,
    })
  }

  console.debug('[useFacetsSelection]', { selected, isActive, dims })

  return [{ selected, isActive, dims }, changeSelection]
}

const Facets = ({
  dimensions = [], // ['tags', 'author.orcid']
  items = [],
  reset = false,
  // memoid='',
  onSelect,
  onInit,
  onMouseEnter,
  onShowMore,
  className,
  style,
}) => {
  const { t } = useTranslation()

  // Resulting state: { selected: [0, 14, 15 ...]}
  const [{ selected, isActive, dims }, setSelection] = useFacetsSelection(dimensions)
  const [stats, setStats] = useState(
    dimensions.reduce(
      (acc, d) => {
        acc[d.name] = 0
        return acc
      },
      {
        total: items.length,
        completed: [],
        available: dimensions.map((d) => d.name),
      },
    ),
  )

  const onInitHandler = (dimension, groups) => {
    console.debug('[Facets] @onInit', dimension.name, groups.length)
    // merge as there are concurrent onInit events
    // https://fr.reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
    setStats((state) => ({
      ...state,
      [dimension.name]: groups.length,
      completed: state.completed.concat([dimension.name]),
    }))
  }

  const onMouseEnterHandler = (e, name, key, indices) => {
    if (typeof onMouseEnter === 'function') {
      onMouseEnter(e, name, key, indices)
    }
  }

  const onResetHandler = (e, name) => {
    e.stopPropagation()
    console.debug('[Facets] @onResetHandler', name)
    setSelection({
      name,
      method: MethodReset,
    })
  }

  const onSelectHandler = (name, key, indices, method = 'filter') => {
    setSelection({ name, key, indices, method })
    // if (typeof onSelect === 'function') {
    //   onSelect(name, isActive ? indices : null, key)
    // }
  }

  useEffect(() => {
    console.debug('[Facets] @useEffect stats', stats)
    if (typeof onInit === 'function' && stats.completed.length === stats.available.length) {
      onInit({ ...stats })
    }
  }, [stats])

  useEffect(() => {
    console.debug('[Facets] @useEffect selected:', selected, 'isActive:', isActive)
    if (typeof onSelect === 'function') {
      onSelect('name', isActive ? selected : null)
    }
  }, [selected])

  console.debug(
    '[Facets] rendered, isActive: ',
    isActive,
    'n.items:',
    items.length,
    'n. selected:',
    selected.length,
    'dimensions:',
    dimensions.length,
  )

  return (
    <div className={`${className}`} style={style}>
      {dimensions.map((dimension) => (
        <div className={`Facets_dimension ${dimension.name}`} key={dimension.name}>
          <h3 className="Facets_dimensionHeading">{t(`dimensions.${dimension.name}`)}</h3>
          <Dimension
            items={items}
            selected={selected}
            activeKeys={dims[dimension.name].keys}
            isActive={isActive}
            name={dimension.name}
            fn={dimension.fn}
            sortFn={dimension.sortFn}
            thresholdFn={dimension.thresholdFn}
            fixed={dimension.fixed}
            onSelect={onSelectHandler}
            onInit={onInitHandler}
            onMouseEnter={onMouseEnterHandler}
            onShowMore={onShowMore}
            ListItem={dimension.ListItem}
          >
            {reset === true && dims[dimension.name].selected.length > 0 && (
              <Button
                className="py-0 mb-2"
                variant="outline-secondary"
                size="sm"
                onClick={(e) => onResetHandler(e, dimension.name)}
              >
                reset
              </Button>
            )}
          </Dimension>
        </div>
      ))}
    </div>
  )
}

// export default React.memo(Facets, (prevProps, nextProps) => prevProps.memoid === nextProps.memoid)
export default Facets
