import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { ChevronDown, Mail } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { DisplayLayerHermeneutics, DisplayLayerNarrative } from '../constants/globalConstants'
import { useArticleStore } from '../store'
import '../styles/components/SwitchLayer.scss'

const CustomToggle = React.forwardRef(function CustomToggle({ children, onClick }, ref) {
  return (
    <a
      href=""
      className="d-block"
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      style={{ textAlign: 'right', boxShadow: 'none' }}
    >
      <span>{children}&nbsp;</span>
      <ChevronDown size={12} />
    </a>
  )
})

const SwitchLayer = ({ disabled, className, binderUrl, emailAddress }) => {
  const { t } = useTranslation()
  const [displayLayer, setDisplayLayer] = useArticleStore((state) => [
    state.displayLayer,
    state.setDisplayLayer,
  ])
  if (disabled) {
    return null
  }

  return (
    <ul className={`SwitchLayer ${className}`} style={{ pointerEvents: 'auto' }}>
      {[DisplayLayerNarrative, DisplayLayerHermeneutics].map((d) => (
        <li
          key={d}
          className={displayLayer === d ? 'active' : ''}
          onClick={() => setDisplayLayer(d)}
        >
          {t(`layers.${d}`)}
        </li>
      ))}
      <Dropdown align="end">
        <Dropdown.Toggle menuVariant="dark" as={CustomToggle} id="dropdown-custom-components ">
          Data
        </Dropdown.Toggle>

        <Dropdown.Menu
          align="end"
          className="shadow border"
          style={{ maxWidth: 350, backgroundColor: 'var(--white)' }}
        >
          <Dropdown.Header style={{ whiteSpace: 'inherit' }}>
            <p className="mb-2">Discover the data behind this article.</p>
            <p
              className="text-dark py-2 mb-0"
              dangerouslySetInnerHTML={{
                __html: binderUrl
                  ? t('actions.gotoBinder', { binderUrl })
                  : t('errors.binderUrlNotAvailable'),
              }}
            />
            <p className="text-dark pt-2 mb-0">
              <Mail size={16} className="me-1" />
              <span
                dangerouslySetInnerHTML={{
                  __html: t('actions.mailtoAuthors', { emailAddress }),
                }}
              />
            </p>
          </Dropdown.Header>
        </Dropdown.Menu>
      </Dropdown>
    </ul>
  )
}

export default SwitchLayer
