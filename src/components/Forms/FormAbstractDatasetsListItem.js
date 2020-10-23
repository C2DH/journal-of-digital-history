import React from 'react'
import FormGroupWrapper from './FormGroupWrapper'
import Dataset from '../../models/Dataset'


const FormAbstractDatasetsListItem = ({ item, onChange, className }) => {
  const handleChange = ({ id, isValid, value }) => {
    console.log(item, id, value)
    onChange({
      item: new Dataset({
        ...item,
        [id]: value,
        isValid,
      })
    })
  }
  return (
    <div className={className}>
      <FormGroupWrapper type="url"
        schemaId="#/definitions/url"
        label="pages.abstractSubmission.datasetDetailsUrl"
        initialValue={item.url}
        onChange={(field) => handleChange({ id: 'url', ...field })}
      />
      <FormGroupWrapper as="textarea"
        schemaId="#/definitions/text500"
        label="pages.abstractSubmission.datasetDetailsLabel"
        initialValue={item.label}
        onChange={(field) => handleChange({ id: 'description', ...field})}
      />
    </div>
  )
}

export default FormAbstractDatasetsListItem
