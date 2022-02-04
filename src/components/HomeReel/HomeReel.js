import React, { useRef } from 'react'
import Slider from 'react-slick'
import { useBoundingClientRect } from '../../hooks/graphics'
import { useGetRawContents } from '../../logic/api/fetchData'
import { StatusSuccess } from '../../constants'
import HomeReelItem from './HomeReelItem'
import '../../styles/components/HomeReel.scss'

const HomeReel = ({ height=180 }) => {
  const [{ width, left }, ref] = useBoundingClientRect()
  const slider = useRef(null)
  // load items
  const { data, status, error } = useGetRawContents({
    url: process.env.REACT_APP_GITHUB_WIKI_NEWS,
    raw: true
  })
  let items = []
  if(status === StatusSuccess) {
    try {
      items = JSON.parse(data.match(/```json([^`]*)```/)[1])
      console.debug('[HomeReel] items loaded:', items.length, '\n from:', process.env.REACT_APP_GITHUB_WIKI_NEWS)
      if (window.location.protocol !== 'http:') {
        items = items.filter(({ draft }) => !draft)
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.warn(
          '[HomeReel] SyntaxError in JSON. Couldn\'t load items from',
            process.env.REACT_APP_GITHUB_WIKI_NEWS,
            data,
            err
        )
      } else {
        console.warn(
          '[HomeReel] Couldn\'t load items from',
          process.env.REACT_APP_GITHUB_WIKI_NEWS,
          err
        )
      }
    }
  } else if (error) {
    console.warn(
      '[HomeReel] Couldn\'t load items from',
      process.env.REACT_APP_GITHUB_WIKI_NEWS,
      error
    )
  }

  const settings = {
    className: "slider variable-width",
    dots: true,
    infinite: false,
    centerMode: true,
    centerPadding: `0px`,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    pauseOnHover: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2750,
    cssEase: "cubic-bezier(0.85, 0, 0.15, 1)"
  };

  const onClickItemHandler = (e, item, idx) => {
    if (slider.current) {
      slider.current.slickGoTo(idx)
    }
  }

  return (
    <div className="HomeReel position-relative" ref={ref} style={{height}}>
      {width > 0 && items.length === 1 && (
        <HomeReelItem
          width={width}
          height={height}
          item={items[0]}
        />
      )}
      {width > 0 && items.length > 1 && (
        <div className="position-absolute" style={{
          // width,
          left: -left,
          right: -left,
          height,
        }}>
          <Slider ref={slider} {...settings}>
            {items.map((item, i) => (
              <HomeReelItem
                key={i}
                onClick={(e, item) => onClickItemHandler(e, item, i)}
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
