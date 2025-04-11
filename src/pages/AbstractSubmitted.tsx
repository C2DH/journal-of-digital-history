import React from 'react'
import { useHistory } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import AbstractSubmissionSummary from '../components/AbstractSubmissionForm/AbstractSubmissionSummary'

const AbstractSubmitted = () => {
  const history = useHistory()

  // Access the formData passed via history.push
  const formData = JSON.parse(localStorage.getItem('formData') || '{}')

  const handleDownloadJson = () => {
    const json = JSON.stringify(formData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const dateNow = formData.dateLastModified.toString().split('T')[0]
    const fileName = `jdh-abstract-submission-${dateNow}.json`
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!formData) {
    return (
      <Container className="page mb-5">
        <h1>Submission Not Found</h1>
        <p>
          It seems like there is no submission data available. Please try submitting your abstract
          again.
        </p>
        <button className="btn btn-primary" onClick={() => history.push('/en/submit')}>
          Go to Homepage
        </button>
      </Container>
    )
  }

  return (
    <Container className="page mb-5">
      <AbstractSubmissionSummary
        formData={formData}
        onReset={() => history.push('/en/submit')}
        handleDownloadJson={handleDownloadJson}
      />
    </Container>
  )
}

export default AbstractSubmitted
