import React, {useState} from 'react'
import arrayMove from 'array-move'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import FormAbstractAuthorsListItem from './FormAbstractAuthorsListItem'
import FormAbstractDatasetsListItem from './FormAbstractDatasetsListItem'
import { useTransition, animated } from 'react-spring'


const components = {
  'FormAbstractAuthorsListItem': FormAbstractAuthorsListItem,
  'FormAbstractDatasetsListItem': FormAbstractDatasetsListItem
}

const FormAbstractGenericSortableList = ({ onChange, ItemClass, listItemComponentTagName }) => {
  const { t } = useTranslation()
  const [ items, setItems ] = useState([
    new ItemClass({ id: 0 })
  ])

  const handleChange = ({item}) => {
    const _items = items.map((d, i) => {
      if (d.id === item.id) {
        return new ItemClass({...item})
      }
      return new ItemClass({...d})
    })
    setItems(_items)
    onChange({ items: _items})
  }

  const addNewItem = () => {
    setItems(items.concat([ new ItemClass({ id: items.length }) ]))
  }

  const removeItem = (item) => {
    setItems(items.filter(d => d.id !== item.id))
  }

  const moveItem = (fromIdx, toIdx) => {
    setItems(arrayMove(items, fromIdx, toIdx))
  }
  const ListItemComponent = components[listItemComponentTagName]

  let height = 0
  const transitions = useTransition(
    items.map((data, i) => {
      const y = +height
      height += 300

      console.info(data, i, height)
      return { ...data, y, keykey: 'aaaaaa-' + data.id }
    }),
    d => d.keykey,
    {
      from: { opacity: 0.5 },
      leave: { opacity: 0.5 },
      enter: ({ y }) => ({ y, opacity:1 }),
      update: ({ y }) => ({ y })
    }
  )
  console.info(transitions)

  return (
    <div>
    <div className="position-relative w-100" style={{ height }}>
      {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
        <animated.div
          key={key} className="generic-list-item"
          style={{ zIndex: items.length - index, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}
        >
        <div className="d-flex align-items-top mb-2 pl-2 pr-1 pb-2 pt-0 border rounded shadow-sm">
          <ListItemComponent className="w-100 mt-2"  item={item} onChange={handleChange} />
          <div className="flex-shrink-1">
            <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="warning"
              onClick={() => removeItem(item)}>✕</Button>
            { index > 0 && (
              <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="secondary"
                onClick={() => moveItem(index, index-1)}>↑</Button>
            )}
            { index < items.length - 1 && (
              <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="secondary"
                onClick={() => moveItem(index, index+1)}>↓</Button>
            )}
          </div>
          </div>
        </animated.div>
      ))}
    </div>
    <pre>{JSON.stringify(items)}</pre>
    <div className="text-center">
      <Button size="sm" variant="secondary" onClick={addNewItem}>{t('actions.addLink')}</Button>
    </div>
    </div>
  )
}

export default FormAbstractGenericSortableList
