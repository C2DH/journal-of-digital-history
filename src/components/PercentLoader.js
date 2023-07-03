import React, { useEffect } from 'react'
import { usePropsStore } from '../store'
import { animated, useSpring, config } from '@react-spring/web'
import './PercentLoader.css'
/**
 * This component is used to show a progress bar when loading a notebook.
 * it makes use of a specific store to keep track of the progress.
 * @param {This } param0
 * @returns
 */

const PercentLoader = () => {
  const [animatedProps, api] = useSpring(() => ({
    width: 0,
    opacity: 1,
    config: config.slow,
  }))
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      usePropsStore.subscribe((state) => {
        // increment the progress bar animated props
        console.debug(
          '[PercentLoader] state.loadingProgress',
          state.loadingProgress,
          state.loadingLabel,
        )
        if (state.loadingProgress === 1) {
          api.start({
            width: 100,
            opacity: 0,
          })
        } else {
          api.start({
            width: state.loadingProgress * 100,
            opacity: 1,
          })
        }
      }),
    [],
  )
  return (
    <div
      className="PercentLoader position-fixed w-100"
      style={{
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <animated.div
        className="PercentLoader_loadingBar position-absolute"
        style={{
          opacity: animatedProps.opacity,
          width: animatedProps.width.to((x) => `${x}%`),
        }}
      />
      <animated.span
        className="PercentLoader_loadingPercentage monospace"
        style={{
          opacity: animatedProps.opacity,
        }}
      >
        {animatedProps.width.to((x) => `${Math.round(x * 10000) / 10000}%`)}
      </animated.span>
    </div>
  )
}

export default PercentLoader
