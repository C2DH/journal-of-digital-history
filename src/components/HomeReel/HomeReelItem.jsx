import { ArrowRight, Zap } from 'react-feather'

const Item = ({ item }) => {
  return (
    <div>
      <h2 className="monospace" style={{ fontSize: 'inherit' }}>
        {item.title}
      </h2>
      <p className="m-0">{item.description}</p>
      {item.url?.length > 0 && (
        <a
          href={item.url}
          className="HomeReel_btn btn btn-sm rounded mt-2"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowRight size={15} />
          &nbsp;&nbsp;{item.label || item.url}
        </a>
      )}
    </div>
  )
}

const HomeReelItem = ({ item, onClick = function () {}, onMouseEnter, width, height }) => {
  const onClickHandler = (e) => {
    if (typeof onClick === 'function') {
      onClick(e, item)
    }
  }
  return (
    <div style={{ width, height }}>
      {!!item.draft && (
        <div
          className="position-absolute top-0 bg-accent text-white px-2 small"
          style={{
            fontSize: '10px',
          }}
        >
          <b>DRAFT</b> &mdash; not visible in production!
        </div>
      )}
      <div
        className="HomeReel_item p-3 me-5 d-flex align-items-top"
        onClick={onClickHandler}
        onMouseEnter={onMouseEnter}
      >
        {' '}
        {!!item.zap && (
          <div className="icon d-none d-md-block me-2">
            <Zap />
          </div>
        )}
        <Item item={item} />
      </div>
    </div>
  )
}

export default HomeReelItem
