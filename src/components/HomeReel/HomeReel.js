import React from "react";
import Slider from "react-slick";
import { useBoundingClientRect } from '../../hooks/graphics'
import '../../styles/components/HomeReel.scss'

const Items = [
  {
    title: 'Open Call for Papers',
    description: 'Contributions from all subfields of (digital) history are welcome!'
  },
  {
    title: 'Special Issue!',
    description: 'Contributions from all subfields of (digital) history are welcome!'
  },
  {
    title: 'A new Issue awaits!',
    description: 'Contributions from all subfields of (digital) history are welcome!'
  },
  {
    title: 'A new Issue awaits!',
    description: 'Contributions from all subfields of (digital) history are welcome!'
  }
]

const HomeReel = ({ height=150 }) => {
  const [{ width, left }, ref] = useBoundingClientRect()

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
    autoplaySpeed: 2000,
    cssEase: "cubic-bezier(0.85, 0, 0.15, 1)"
  };

  return (
    <div className="HomeReel position-relative" ref={ref} style={{height}}>
      {width > 0 && (
        <div className="position-absolute" style={{
          // width,
          left: -left,
          right: -left,
          height,
        }}>
          <Slider {...settings}>
            {Items.map((item, i) => (
              <div  key={i} style={{
                width, height,

              }}>
                <div className="HomeReel_item p-3 me-5 d-flex align-items-center">
                  <div className=" me-2"></div>
                  <div>
                    <h2 className="monospace" style={{fontSize: 'inherit'}}>
                      {item.title}
                    </h2>
                    <p className="m-0">{item.description}</p>
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
