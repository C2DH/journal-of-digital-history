import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SubmissionSummary from '../components/AbstractSubmitted/SubmissionSummary'

const AbstractSubmitted = () => {
  const navigate = useNavigate()

  // Access the formData 
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
        <button className="btn btn-primary" onClick={() => navigate('/en/submit')}>
          Go to Homepage
        </button>
      </Container>
    )
  }

  return (
    <Container className="page mb-5">
      <SubmissionSummary
        formData={formData}
        navigateBack={() => navigate('/en/submit')}
        handleDownloadJson={handleDownloadJson}
      />
    </Container>
  )
}

export default AbstractSubmitted
