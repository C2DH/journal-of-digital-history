import React from 'react'
import { useTranslation } from 'react-i18next'
import { useOnScreen } from '../../hooks/graphics'
import { Button } from 'react-bootstrap'
import { Send } from 'react-feather'

const ArticleMobileDisclaimer = () => {
  const [{ intersectionRatio }, ref] = useOnScreen()
  const { t } = useTranslation()
  const clickHandler = () => {
    window.location = 'mailto:?subject=%22a%20nice%20title%22%20read%20reminder%20JDH&body=Hi!%0A%0ANice%20to%20meet%20you'
  }

  return (
    <div ref={ref} className="ArticleMobileDisclaimer position-absolute w-100 pointer-events-none" style={{height: '200%'}}>
      <div className={`ArticleMobileDisclaimer_popup position-fixed w-100 h-100 ${intersectionRatio > 0 ? 'active' : ''}`}
        style={{top:0, zIndex:100}}>
        <div className="ArticleMobileDisclaimer_popup_inner position-absolute top-0 shadow">
          <div className="p-3 d-flex flex-column align-items-center justify-content-between h-100 w-100 pointer-events-auto">
            <h2 className="m-0 w-100">Explore all 3 layers: <br/> Only available on Desktop!</h2>
            <p className="m-0 w-100" dangerouslySetInnerHTML={{
              __html: t('pages.article.mobileDisclaimer')
            }}/>
            <Button block className="w-100 shadow-sm" variant="outline-secondary" onClick={clickHandler}>Mail me this! <Send size={14}/></Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleMobileDisclaimer
