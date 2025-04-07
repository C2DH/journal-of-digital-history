import React, { useRef, useEffect } from 'react'
import Slider from 'react-slick'
import { useBoundingClientRect } from '../../hooks/graphics'
import { useGetRawContents } from '../../logic/api/fetchData'
import { StatusSuccess } from '../../constants/globalConstants'
import HomeReelItem from './HomeReelItem'
import '../../styles/components/HomeReel.scss'

const Forward = 1
const Backward = 0

const HomeReel = ({ height = 180, delay = 1500 }) => {
  const [{ width, left }, ref] = useBoundingClientRect()
  const sliderTimer = useRef(null)
  const sliderDirection = useRef(1)
  const slider = useRef(null)
  // load items
  const { data, status, error } = useGetRawContents({
    url: process.env.REACT_APP_GITHUB_WIKI_NEWS,
    raw: true,
  })
  let items = []
  if (status === StatusSuccess) {
    try {
      items = JSON.parse(data.match(/```json([^`]*)```/)[1])
      console.debug(
        '[HomeReel] items loaded:',
        items.length,
        '\n from:',
        process.env.REACT_APP_GITHUB_WIKI_NEWS,
      )
      if (window.location.protocol !== 'http:') {
        items = items.filter(({ draft }) => !draft)
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.warn(
          "[HomeReel] SyntaxError in JSON. Couldn't load items from",
          process.env.REACT_APP_GITHUB_WIKI_NEWS,
          data,
          err,
        )
      } else {
        console.warn(
          "[HomeReel] Couldn't load items from",
          process.env.REACT_APP_GITHUB_WIKI_NEWS,
          err,
        )
      }
    }
  } else if (error) {
    console.warn(
      "[HomeReel] Couldn't load items from",
      process.env.REACT_APP_GITHUB_WIKI_NEWS,
      error,
    )
  }

  const onClickItemHandler = (e, item, idx) => {
    if (slider.current) {
      slider.current.slickGoTo(idx)
    }
  }

  const onInitHandler = () => {
    // console.debug('[HomeReel] @onInitHandler', args)
    // stat timer
    playInfiniteSwingingTimer()
  }
  const stopInfiniteSwingingTimer = () => {
    // console.debug('[HomeReel] .stopInfiniteSwingingTimer')
    clearTimeout(sliderTimer.current)
  }
  const playInfiniteSwingingTimer = () => {
    if (!slider.current) {
      console.warn('[HomeReel] Slider initialized, but no Ref is present. Try again in 0.1s')
      sliderTimer.current = setTimeout(playInfiniteSwingingTimer, 100)
      return
    }
    clearTimeout(sliderTimer.current)
    // console.debug('[HomeReel] .playInfiniteSwingingTimer() scheduled.')
    sliderTimer.current = setTimeout(() => {
      if (!slider.current) {
        return
      }
      const idx = slider.current.innerSlider.state.currentSlide
      const l = slider.current.innerSlider.state.slideCount
      // console.debug('[HomeReel] .playInfiniteSwingingTimer() current:', idx, l, sliderDirection.current)

      if (sliderDirection.current === Forward) {
        if (idx + 1 < l) {
          slider.current.slickGoTo(idx + 1)
        } else {
          sliderDirection.current = Backward
          // this is END edge, swithc direction, then next
          slider.current.slickGoTo(idx - 1)
        }
      } else {
        if (idx > 0) {
          slider.current.slickGoTo(idx - 1)
        } else {
          sliderDirection.current = Forward
          // this is END edge, swithc direction, then next
          slider.current.slickGoTo(idx + 1)
        }
      }
      playInfiniteSwingingTimer()
    }, slider.current?.props.autoplaySpeed || delay)
  }

  useEffect(() => {
    return function cleanup() {
      clearTimeout(sliderTimer.current)
    }
  }, [])

  return (
    <div className="HomeReel position-relative" ref={ref} style={{ height }}>
      {width > 0 && items.length === 1 && (
        <HomeReelItem width={width} height={height} item={items[0]} />
      )}
      {width > 0 && items.length > 1 && (
        <div
          className="HomeReel_rail position-absolute"
          onMouseEnter={stopInfiniteSwingingTimer}
          onMouseLeave={playInfiniteSwingingTimer}
          style={{
            // width,
            left: -left,
            right: -left,
            height,
            paddingTop: 'var(--spacer-2)',
          }}
        >
          <Slider
            ref={slider}
            className="slider variable-width"
            dots
            swipeToSlide
            infinite={false}
            centerMode
            centerPadding="0px"
            slidesToShow={1}
            slidesToScroll={1}
            variableWidth
            pauseOnHover={false}
            speed={1000}
            autoplay={false}
            autoplaySpeed={3750}
            onInit={onInitHandler}
          >
            {items.map((item, i) => (
              <HomeReelItem
                key={i}
                onClick={(e, item) => onClickItemHandler(e, item, i)}
                onMouseEnter={stopInfiniteSwingingTimer}
                height={height}
                width={width}
                item={item}
              />
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default HomeReel
