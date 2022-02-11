import React from 'react'
import { a, animated } from 'react-spring'

const AnimatedTooltip = ({ animatedProps, forwardedRef }) => {
  console.debug('[AnimatedTooltip] rendered')
  return (
    <a.div className="ArticleFingerprintTooltip shadow pointer-events-none position-fixed top-0" style={{
      ...animatedProps
    }}>
      <div className="small mb-1 pb-1" style={{
        borderBottom: '1px solid'
      }}>
        <a.span>
          {animatedProps.id.to(() => `${forwardedRef.current.idx + 1}/${forwardedRef.current.length}`)}
        </a.span>
        &nbsp;
        <a.span className="ArticleFingerprintTooltip_heading">
          {animatedProps.id.to(() => {
            return (
              forwardedRef.current.datum.isMetadata
                ? '(metadata)'
                : forwardedRef.current.datum.isHermeneutic
                  ? 'Hermeneutics'
                  : 'Narrative'
            )
          })}
        </a.span>
      </div>
      <div>
        <a.span>{animatedProps.id.to(() => String(forwardedRef.current.datum.firstWords))}</a.span>
        <a.span>{animatedProps.id.to(() => String(forwardedRef.current.datum.type))}</a.span>
      </div>
    </a.div>
  )
}

export default animated(AnimatedTooltip)
