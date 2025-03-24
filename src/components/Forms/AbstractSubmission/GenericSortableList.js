import React, {useState, useEffect} from 'react'
import arrayMove from 'array-move'
import { Button } from 'react-bootstrap'
import FormAbstractAuthorsListItem from './Sections/Author/ListItem'
import FormAbstractDatasetsListItem from './Sections/Datasets/ListItem'

const components = {
  'FormAbstractAuthorsListItem': FormAbstractAuthorsListItem,
  'FormAbstractDatasetsListItem': FormAbstractDatasetsListItem,
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
    const _items = items.map((d) => {
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

  return (
    <div>
    <div className="position-relative w-100">
      {items.map((item, index) => (
        <div key={index} className="d-flex align-items-top mb-2 ps-2 pe-1 pb-2 pt-0 border border-dark rounded shadow-sm">
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
    </div>
    {debug && <pre>{JSON.stringify(items)}</pre>}
    <div className="text-right">
      <Button size="sm" variant="outline-dark" onClick={()=> { 
        addNewItem()
      }}>{addNewItemLabel} ＋</Button>
    </div>
    </div>
  )
}

export default FormAbstractGenericSortableList
