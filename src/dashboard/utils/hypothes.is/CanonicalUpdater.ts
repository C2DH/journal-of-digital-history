import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const CanonicalUpdater = () => {
  // This component updates the canonical link in the document head
  // use for Hypothes.is integration
  const location = useLocation()

  useEffect(() => {
    const canonicalUrl = window.location.origin + window.location.pathname

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)
  }, [location])

  return null
}

export default CanonicalUpdater
