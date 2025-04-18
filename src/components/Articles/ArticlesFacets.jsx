import React from 'react'
import { useTranslation } from 'react-i18next'
import { IsMobile } from '../../constants/globalConstants'
import Facets from '../Facets'
import DimensionGroupListItem from '../Facets/DimensionGroupListItem'
import IssueLabel from '../Issue/IssueLabel'

function dimensionThresholdFn(groups, activeGroups) {
  if (IsMobile) {
    return 5
  }
  if (activeGroups > 0) {
    return 10
  }
  // according to group composition
  const wished = groups.filter((d) => {
    return d.count > 1
  }).length
  return Math.min(10, Math.max(wished, 10))
}

function dimensionSortFnAscending(a, b) {
  return sortKeys(a, b, 'asc');
}

function dimensionSortFnDescending(a, b) {
  return sortKeys(a, b, 'desc');
}

function sortKeys(a, b, order) {
  const isNumericA = /^\d+$/.test(a.key);
  const isNumericB = /^\d+$/.test(b.key);

  if (isNumericA && isNumericB) {
    return order === 'asc'
      ? parseInt(a.key, 10) - parseInt(b.key, 10)
      : parseInt(b.key, 10) - parseInt(a.key, 10);
  }
  if (!isNumericA && !isNumericB) {
    return order === 'asc'
      ? a.key.localeCompare(b.key)
      : b.key.localeCompare(a.key);
  }
  // Mixed case: numeric keys come after string keys
  return isNumericA ? 1 : -1;
}


const TagListItem = (props) => {
  return (
    <DimensionGroupListItem {...props}>
      {({ group, name: category }) => {
        const tag = props.items[group.indices[0]].tags.find(
          (t) => t.category === category && t.name === group.key,
        )
        return (
          <div
            className="d-flex align-items-center flex-nowrap"
            title={tag.data?.info?.summary || group.key}
          >
            <div>{group.key}</div>
            <div className="badge mx-1">{tag.data.language}</div>
            <div>({group.count})</div>
          </div>
        )
      }}
    </DimensionGroupListItem>
  )
}
const IssueListItem = (props) => {
  return (
    <DimensionGroupListItem {...props}>
      {({ group }) => {
        const issue = props.items[group.indices[0]].issue
        return (
          <div className="d-flex align-items-center flex-nowrap" title={issue.name || group.key}>
            <IssueLabel pid={issue.pid} name={issue.name} />
            <div>&nbsp;({group.count})</div>
          </div>
        )
      }}
    </DimensionGroupListItem>
  )
}

const ShowMoreLabel = ({ active, n }) => {
  const { t } = useTranslation()
  if (n === 0) {
    return null
  }
  return (
    <span>{t(active ? 'dimensions.actions.showLess' : 'dimensions.actions.showMore', { n })}</span>
  )
}
const Dimensions = [
  {
    fixed: true,
    name: 'issue',
    sortFn: dimensionSortFnDescending,
    thresholdFn: dimensionThresholdFn,
    fn: (d) => d.issue.pid,
    isArray: false,
    ListItem: IssueListItem,
  },
  {
    fixed: true,
    name: 'narrative',
    sortFn: dimensionSortFnAscending,
    thresholdFn: dimensionThresholdFn,
    fn: (d) => d.tags.filter((t) => t.category === 'narrative').map((t) => t.name),
    isArray: true,
    ListItem: DimensionGroupListItem,
  },
  {
    fixed: true,
    name: 'tool',
    sortFn: dimensionSortFnAscending,
    thresholdFn: dimensionThresholdFn,
    fn: (d) => d.tags.filter((t) => t.category === 'tool').map((t) => t.name),
    isArray: true,
    ListItem: TagListItem,
  },
]

const ArticlesFacets = ({ items, onSelect, onShowMore, className }) => {
  return (
    <Facets
      dimensions={Dimensions}
      items={items}
      onSelect={onSelect}
      onInit={(args) => console.debug('[ArticlesFacets] @init', args)}
      ShowMoreLabel={ShowMoreLabel}
      onShowMore={onShowMore}
      className={className}
    />
  )
}

export default ArticlesFacets