import React, {useState} from 'react'
import arrayMove from 'array-move'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import FormAbstractAuthorsListItem from './FormAbstractAuthorsListItem'
import FormAbstractDatasetsListItem from './FormAbstractDatasetsListItem'

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
    setItems(items.map((d, i) => {
      if (d.id === item.id) {
        return new ItemClass({...item})
      }
      return new ItemClass({...d})
    }))
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

  return (
    <div>
      {items.map((item, idx) => (
        <div key={`dataset-url-${item.id}`} className="d-flex align-items-top mb-2 pl-2 pr-1 pb-2 pt-0 border rounded shadow-sm">
          <ListItemComponent className="w-100 mt-2"  item={item} onChange={handleChange} />
          <div className="flex-shrink-1">
            <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="warning"
              onClick={() => removeItem(item)}>✕</Button>
            { idx > 0 && (
              <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="secondary"
                onClick={() => moveItem(idx, idx-1)}>↑</Button>
            )}
            { idx < items.length - 1 && (
              <Button size="sm" className="d-block rounded-circle p-0 m-3" style={{height: '25px', width:'25px', lineHeight: '25px'}} variant="secondary"
                onClick={() => moveItem(idx, idx+1)}>↓</Button>
            )}
          </div>
        </div>
      ))}
      <pre>{JSON.stringify(items)}</pre>
      <div className="text-center">
        <Button size="sm" variant="secondary" onClick={addNewItem}>{t('actions.addLink')}</Button>
      </div>
    </div>
  )
}

export default FormAbstractGenericSortableList
