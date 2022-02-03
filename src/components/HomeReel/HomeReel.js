import React from 'react'
import Slider from 'react-slick'
import { Zap } from 'react-feather'
import { useBoundingClientRect } from '../../hooks/graphics'
import { useGetRawContents } from '../../logic/api/fetchData'
import { StatusSuccess } from '../../constants'
import '../../styles/components/HomeReel.scss'


const HomeReel = ({ height=150 }) => {
  const [{ width, left }, ref] = useBoundingClientRect()
  // load items
  const { data, status, error } = useGetRawContents({
    url: process.env.REACT_APP_GITHUB_WIKI_NEWS,
    raw: true
  })
  let items = []
  if(status === StatusSuccess) {
    try {
      items = JSON.parse(data.match(/```json([^`]*)```/)[1])
    } catch (err) {
      console.warn(
        '[HomeReel] Couldn\'t load items from',
        process.env.REACT_APP_GITHUB_WIKI_NEWS,
        err
      )
    }
  } else if (error) {
    console.warn(
      '[HomeReel] Couldn\'t load items from',
      process.env.REACT_APP_GITHUB_WIKI_NEWS,
      error
    )
  }
  console.debug('[HomeReel] items loaded:',items.length, 'from', process.env.REACT_APP_GITHUB_WIKI_NEWS)

  const settings = {
    className: "slider variable-width",
    dots: true,
    infinite: true,
    centerMode: true,
    centerPadding: `0px`,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    pauseOnHover: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "cubic-bezier(0.85, 0, 0.15, 1)"
  };

  return (
    <div className="HomeReel position-relative" ref={ref} style={{height}}>
      {width > 0 && items.length > 0 && (
        <div className="position-absolute" style={{
          // width,
          left: -left,
          right: -left,
          height,
        }}>
          <Slider {...settings}>
            {items.map((item, i) => (
              <div  key={i} style={{
                width, height,

              }}>
                <div className="HomeReel_item p-3 me-5 d-flex align-items-top">
                  {!!item.zap && (
                    <div className="icon me-2">
                      <Zap/>
                    </div>
                  )}
                  <div>
                    <h2 className="monospace" style={{fontSize: 'inherit'}}>
                      {item.title}
                    </h2>
                    <p className="m-0">{item.description}</p>
                    {item.url?.length > 0 && (
                      <a href={item.url} norel="noreferrer">{item.label || item.url}</a>
                    )}
                    </div>
                  </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default HomeReel
