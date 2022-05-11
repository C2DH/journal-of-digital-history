import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DimensionGroupListItem from './DimensionGroupListItem'

export const MethodFilter = 'filter'
export const MethodReplace = 'replace'
export const MethodAdd = 'add'
export const MethodRemove = 'remove'
export const MethodReset = 'reset'

const reductor = (fn, selected, isActive) => (acc, item, idx) => {
  const key = fn(item)
  if (Array.isArray(key)) {
    key.forEach((k) => {
      if (!acc[k]) {
        acc[k] = {
          key: k,
          count: 0,
          indices: [],
          selected: []
        }
      }
      acc[k].indices.push(idx)
      // we store in selected only if isActive and
      // if IDX is present in the selected list
      // we set count according to selected if isActive, to indices otherwise
      if (!isActive) {
        acc[k].count = acc[k].indices.length
      } else if (isActive && selected.indexOf(idx) !== -1) {
        acc[k].selected.push(idx)
        acc[k].count = acc[k].selected.length
      }
    })
    return acc
  }
  if (!acc[key]) {
    acc[key] = { key, count: 0, indices:[], selected: [] }
  }
  // we store all indices
  acc[key].indices.push(idx)
  // we store in selected only if isActive and
  // if IDX is present in the selected list
  // we set count according to selected if isActive, to indices otherwise
  if (!isActive) {
    acc[key].count = acc[key].indices.length
  } else if (isActive && selected.indexOf(idx) !== -1) {
    acc[key].selected.push(idx)
    acc[key].count = acc[key].selected.length
  }
  return acc
}



const Dimension = ({
  items = [],
  // group keys that are used actively (even if the resulting selection is 0)
  activeKeys = [],
  // is the dimension filtering on smt
  isActive = false,
  // selected idx based on all siblings dimensions
  selected = [],
  // selected idx based on this dimension
  // filtered=[],
  name = '',
  fn,
  // function shoud return the nuber of elements to put in advance
  thresholdFn = (groups, activeGroups, isActive) => {
    if (isActive) {
      return 10
    }
    // according to group composition
    const wished = groups.filter((d) => {
      return d.count > 1
    }).length
    return Math.min(10, Math.max(wished, 10))
  },
  sortFn = (a,b) => {
    return a.count === b.count
      ? a.key > b.key
        ? 1 : -1
      : a.count > b.count ? -1 : 1
  },
  fixed=false,
  onInit,
  onSelect,
  onMouseEnter,
  children,
  ListItem=DimensionGroupListItem
}) => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const groupsIndex = items.reduce(reductor(fn, selected, isActive), {})
  const groups = Object.values(groupsIndex).sort(sortFn)
  let activeGroups = []
  // remove active elments from the list:
  if(!fixed) {
    activeKeys.forEach((activeKey) => {
      const idx = groups.findIndex((d) => d.key === activeKey)
      if (idx !== -1) {
        activeGroups = activeGroups.concat(groups.splice(idx, 1))
      }
    })
  }
  const threshold = thresholdFn(groups, activeGroups, isActive)
  const topGroups = groups.slice(0, threshold)
  const restGroups = groups.slice(threshold)

  const onClickHandler = (e, { key, indices, count }) => {
    e.stopPropagation()
    if (typeof onSelect === 'function') {
      onSelect(
        name,
        key,
        indices,
        count === 0 ? MethodReplace : MethodFilter
      )
    }
  }

  const onMouseEnterHandler = (e, { key, indices }) => {
    if (typeof onMouseEnter === 'function') {
      onMouseEnter(e, name, key, indices)
    }
  }

  const onRemoveHandler = (e, { key, indices }) => {
    e.stopPropagation()
    if (typeof onSelect === 'function') {
      onSelect(
        name,
        key,
        indices,
        MethodRemove
      )
    }
  }

  useEffect(() => {
    if (typeof onInit === 'function') {
      onInit({ name }, groups)
    }
  }, [])

  useEffect(() => {
    setShowMore(false)
  }, [activeKeys])

  return (
    <div className="Dimension">
      {children}
      <ul className={[
        isActive ? 'active': '',
        showMore ? 'expanded': ''
      ].join(' ')}>
        {activeGroups.map((group) => (
          <ListItem
            key={group.key}
            name={name}
            isActive
            onRemove={(e) => onRemoveHandler(e, group)}
            onClick={(e) => onClickHandler(e, group)}
            onMouseEnter={(e) => onMouseEnterHandler(e, group)}
            group={group}
          />
        ))}
        {topGroups.map((group) => (
          <ListItem
            key={group.key}
            name={name}
            isActive={activeKeys.includes(group.key)}
            onRemove={(e) => onRemoveHandler(e, group)}
            onClick={(e) => onClickHandler(e, group)}
            onMouseEnter={(e) => onMouseEnterHandler(e, group)}
            group={group}
          />
        ))}
        {showMore && restGroups.map((group) => (
          <ListItem
            key={group.key}
            name={name}
            isActive={activeKeys.includes(group.key)}
            onRemove={(e) => onRemoveHandler(e, group)}
            onClick={(e) => onClickHandler(e, group)}
            onMouseEnter={(e) => onMouseEnterHandler(e, group)}
            group={group}
          />
        ))}
        <li>
          <button className="Dimension_toggleShowMoreBtn" onClick={() => setShowMore(!showMore)}>
            <span>{t(showMore ? 'dimensions.actions.showLess': 'dimensions.actions.showMore', {
              n: restGroups.length
            })}
            </span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Dimension
