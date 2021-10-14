import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnScreen } from '../../hooks/graphics'
import { Button } from 'react-bootstrap'
import { Send, X } from 'react-feather'
import { extractExcerpt } from '../../logic/api/metadata'


const ArticleMobileDisclaimer = ({ title }) => {
  const [{ intersectionRatio }, ref] = useOnScreen()
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useTranslation()
  const clickHandler = () => {
    const url = String(window.location)
    const subject = t('ArticleMobileDisclaimerSubject', {
      title: extractExcerpt(title, 10, '...')
    })
    const body = t('ArticleMobileDisclaimerBody', { url, title })
    window.location = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div ref={ref} className="ArticleMobileDisclaimer position-absolute w-100 pointer-events-none" style={{height: '200%'}}>
      <div className={`ArticleMobileDisclaimer_popup position-fixed w-100 h-100 ${isVisible && intersectionRatio > 0 ? 'active' : ''}`}
        style={{top:0, zIndex:100}}>
        <div className="ArticleMobileDisclaimer_popup_inner position-absolute top-0 shadow">
          <div className="p-3 d-flex flex-column align-items-center justify-content-between h-100 w-100 pointer-events-auto">
            <div className="d-flex align-items-start ">
              <h2 className="m-0 w-100">Explore all 3 layers: <br/> Only available on Desktop!</h2>
              <Button size="sm" variant="transparent" onClick={() => setIsVisible(false)}><X/></Button>
            </div>
            <p className="m-0 w-100" dangerouslySetInnerHTML={{
              __html: t('pages.article.mobileDisclaimer')
            }}/>
            <Button className="w-100 shadow-sm" variant="outline-secondary" onClick={clickHandler}>Mail me this! <Send size={14}/></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleMobileDisclaimer
