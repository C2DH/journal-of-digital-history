import React from 'react'
import { a, animated } from 'react-spring'


const ArticleFingerprintTooltip = ({ animatedProps, forwardedRef }) => {
  try{
  return (
    <a.div className="ArticleFingerprintTooltip shadow pointer-events-none position-fixed top-0" style={{
      ...animatedProps,
      color: animatedProps.id.to(() => {
        const type =  String(forwardedRef.current.datum.type)
        const isHermeneutic =  Boolean(forwardedRef.current.datum.isHermeneutic)
        return (
          type === 'code'
            ? 'var(--white)'
            : isHermeneutic
              ? 'var(--secondary)'
              : 'var(--white)'
        )
      }),
      backgroundColor: animatedProps.id.to(() => {
        const type =  String(forwardedRef.current.datum.type)
        const isHermeneutic =  Boolean(forwardedRef.current.datum.isHermeneutic)
        return (
          type === 'code'
            ? 'var(--accent)'
            : isHermeneutic
              ? 'var(--primary)'
              : 'var(--secondary)'
        )
      }),
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
                ? forwardedRef.current.datum.tags?.join(', ')
                : forwardedRef.current.datum.isHermeneutic
                  ? 'Hermeneutics'
                  : 'Narrative'
            )
          })}
        </a.span>
      </div>
      <a.div
        className="ArticleFingerprintTooltip_content"
        style={{
          fontFamily: animatedProps.id.to(() => {
            return String(forwardedRef.current.datum.type) === 'code'
              ? 'var(--font-family-monospace)'
              : 'inherit'
          }),
          backgroundColor: animatedProps.id.to(() => {
            return String(forwardedRef.current.datum.type) === 'code'
              ? 'rgba(0,0,0,.12)'
              : 'inherit'
          }),
          padding: animatedProps.id.to(() => {
            return String(forwardedRef.current.datum.type) === 'code'
              ? 'var(--spacer-2)'
              : '0'
          }),
        }}
      >
        {animatedProps.id.to(() => String(forwardedRef.current.datum.firstWords))}
      </a.div>
    </a.div>
  )
  } catch(e) {
    console.debug('[ArticleFingerprintTooltip] current', forwardedRef.current, animatedProps )
    console.warn('[ArticleFingerprintTooltip] threw an error, skip', e);
    return null
  }
}

export default animated(ArticleFingerprintTooltip)
