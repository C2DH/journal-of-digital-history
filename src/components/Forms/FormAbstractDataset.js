import React, { useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { Form, Col, Row } from 'react-bootstrap'
import FormGroupWrapper from './FormGroupWrapper'


const FormAbstractDataset = ({ groupId, onChange }) => {
  // const { t } = useTranslation()
  const [ results, setResults ] = useState([
    { id: 'datasetDetails', value: null, label: 'pages.abstractSubmission.datasetDetails' },
    { id: 'datasetUrls', value: null, label: 'pages.abstractSubmission.datasetUrls' }
  ])

  const handleChange = ({ id, value, isValid }) => {
    const _results = results.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    })
    setResults(_results)
    // output only if is valid
    const isGroupValid = !_results.some(d => !d.isValid)

    if (isGroupValid) {
      onChange({
        id: groupId,
        value: _results.map(d => d.value),
        isValid: isGroupValid,
      })
    }
  }
  return (
    <div>
      <FormGroupWrapper
        id='datasetDetails'
        as="textarea"
        rows={5}
        schemaId='#/properties/datasetDetails'
        label='pages.abstractSubmission.datasetDetails' ignoreWhenLengthIslessThan={5}
        onChange={handleChange}
      />
    </div>
  )
}

export default FormAbstractDataset