import React, {useState, useEffect} from 'react'
import arrayMove from 'array-move'
import { Button } from 'react-bootstrap'
import FormAbstractAuthorsListItem from './FormAbstractAuthorsListItem'
import FormAbstractDatasetsListItem from './FormAbstractDatasetsListItem'
// import { useTransition, animated } from 'react-spring'


const components = {
  'FormAbstractAuthorsListItem': FormAbstractAuthorsListItem,
  'FormAbstractDatasetsListItem': FormAbstractDatasetsListItem
}

const FormAbstractGenericSortableList = ({
  onChange, ItemClass, listItemComponentTagName,
  initialItems,
  addNewItemLabel,
  debug=false
}) => {
  const [ items, setItems ] = useState(initialItems || [])
  // console.info('items updated', items, initialItems)
  useEffect(() => {
    if(initialItems) {
      setItems(initialItems.map(d => new ItemClass({...d})));
    }
  }, [initialItems, ItemClass]);

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
    const _items = items.concat([ new ItemClass({ id: items.length }) ])
    setItems(_items)
    onChange({ items: _items})
  }

  const removeItem = (item) => {
    const _items = items.filter(d => d.id !== item.id)
    setItems(_items)
    onChange({ items: _items})
  }

  const moveItem = (fromIdx, toIdx) => {
    setItems(arrayMove(items, fromIdx, toIdx))
  }
  const ListItemComponent = components[listItemComponentTagName]

  // let height = 0
  // const transitions = useTransition(
  //   items.map((data, i) => {
  //     const y = +height
  //     height += 380
  //
  //     console.info('useTransition', data, i, height)
  //     return { ...data, y, keykey: 'aaaaaa-' + data.id }
  //   }),
  //   {
  //     from: { opacity: 0.5 },
  //     leave: { opacity: 0.5 },
  //     enter: ({ y }) => ({ y, opacity:1 }),
  //     update: ({ y }) => ({ y })
  //   }
  // )

  return (
    <div>
    <div className="position-relative w-100">
      {items.map((item, index) => (
        <div key={index} className="d-flex align-items-top mb-2 pl-2 pr-1 pb-2 pt-0 border border-dark rounded shadow-sm">
          <ListItemComponent className="w-100 mt-2"  item={item} onChange={handleChange} />
          <div className="flex-shrink-1">
            <Button size="sm" className="d-block rounded-circle border-dark border p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '23px'}} variant="warning"
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
      ))}
      {/*/ transitions(({ opacity, y }, item) => (
        <animated.div
          key={item.id} className="generic-list-item"
          style={{ zIndex: 1, height: 350, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), ...rest }}
        >
        <div className="d-flex align-items-top mb-2 pl-2 pr-1 pb-2 pt-0 border border-dark rounded shadow-sm">
          <ListItemComponent className="w-100 mt-2"  item={item} onChange={handleChange} />
          <div className="flex-shrink-1">
            <Button size="sm" className="d-block rounded-circle border-dark border p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '23px'}} variant="warning"
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
      )) /*/}
    </div>
    {debug && <pre>{JSON.stringify(items)}</pre>}
    <div className="text-right">
      <Button size="sm" variant="outline-dark" onClick={addNewItem}>{addNewItemLabel} ＋</Button>
    </div>
    </div>
  )
}

export default FormAbstractGenericSortableList
