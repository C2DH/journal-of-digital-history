import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import FormGroupWrapper from './FormGroupWrapper'
import { Button } from 'react-bootstrap'
import arrayMove from 'array-move'

class DatasetUrl {
  constructor({ id, url = '', license, type, label, isValid } = {}) {
    this.id = id
    this.url = url
    this.label = label
    this.license = license
    this.type = type
    this.isValid = isValid
  }
}

const FormAbstractDatasetUrlsListItem = ({ item, onChange, className }) => {
  const handleChange = ({ id, isValid, value }) => {
    onChange({
      item: new DatasetUrl({
        ...item,
        [id]: value,
        isValid,
      })
    })
  }
  return (
    <div className={className}>
      <FormGroupWrapper type="url" id="url"
        schemaId="#/properties/datasetUrl"
        label="pages.abstractSubmission.datasetDetailsUrl"
        initialValue={item.url}
        onChange={handleChange}
      />
      <FormGroupWrapper as="textarea" id="label"
        schemaId="#/properties/datasetLabel"
        label="pages.abstractSubmission.datasetDetailsLabel"
        initialValue={item.label}
        onChange={handleChange}
      />
    </div>
  )
}

const FormAbstractDatasetUrlsList = ({ onChange }) => {
  const { t } = useTranslation()
  const [ items, setItems ] = useState([
    new DatasetUrl({ id: 0 })
  ])
  
  const handleChange = ({item}) => {
    setItems(items.map((d, i) => {
      if (d.id === item.id) {
        return new DatasetUrl({...item})
      }
      return new DatasetUrl({...d})
    }))
  }
  
  const addNewItem = () => {
    setItems(items.concat([ new DatasetUrl({ id: items.length }) ]))
  }
  
  const removeItem = (item) => {
    setItems(items.filter(d => d.id !== item.id))
  }
  
  const moveItem = (fromIdx, toIdx) => {
    setItems(arrayMove(items, fromIdx, toIdx))
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div className="d-flex align-items-top mb-2 pl-2 pr-1 pb-2 pt-0 border rounded shadow-sm">
          <FormAbstractDatasetUrlsListItem className="w-100 mt-2" key={`dataset-url-${item.id}`} item={item} onChange={handleChange} />
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

export default FormAbstractDatasetUrlsList