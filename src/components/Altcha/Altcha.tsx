import './Altcha.css'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Importing altcha package will introduce a new element <altcha-widget>
import 'altcha'

interface AltchaProps {
  onStateChange?: (ev: Event | CustomEvent) => void
}

const Altcha = forwardRef<{ value: string | null }, AltchaProps>(({ onStateChange }, ref) => {
  const widgetRef = useRef<AltchaWidget & AltchaWidgetMethods & HTMLElement>(null)
  const [value, setValue] = useState<string | null>(null)

  useImperativeHandle(ref, () => {
    return {
      get value() {
        return value
      },
    }
  }, [value])

  useEffect(() => {
    const handleStateChange = (ev: Event | CustomEvent) => {
      if ('detail' in ev) {
        setValue(ev.detail.payload || null)
        onStateChange?.(ev)
      }
    }

    const { current } = widgetRef

    if (current) {
      current.addEventListener('statechange', handleStateChange)
      return () => current.removeEventListener('statechange', handleStateChange)
    }
  }, [onStateChange])

  /* Configure your `challengeurl` and remove the `test` attribute, see docs: https://altcha.org/docs/v2/widget-integration/  */
  return (
    <altcha-widget
      ref={widgetRef}
      style={{
        '--altcha-max-width': '100%',
      }}
      // debug
      challengeurl={`/api/captcha`}
    ></altcha-widget>
  )
})

export default Altcha
