import { MinusCircle, PlusCircle } from 'iconoir-react'
import { useRef, useState } from 'react'

import styles from './Collapse.module.css'

const Collapse = ({
  className = '',
  collapsable = false,
  collapsed = false,
  children,
  iconOpen: IconOpen = MinusCircle,
  iconClosed: IconClosed = PlusCircle,
  iconSize = 24,
  iconStrokeWidth = 1,
}) => {
  const [isCollapsed, setCollapsed] = useState(collapsed)
  const ref = useRef()

  const onIconClickHandler = () => {
    setCollapsed(!isCollapsed)
  }

  return (
    <div className={`${styles.Collapse} ${className}`}>
      {collapsable && (
        <button onClick={onIconClickHandler} className={`${styles.icon} ${className}-icon`}>
          {isCollapsed ? (
            <IconClosed width={iconSize} height={iconSize} strokeWidth={iconStrokeWidth} />
          ) : (
            <IconOpen width={iconSize} height={iconSize} strokeWidth={iconStrokeWidth} />
          )}
        </button>
      )}

      <div
        className={`${styles.collapse_box} ${className}-collapse-box`}
        style={{ height: isCollapsed ? 0 : ref.current?.offsetHeight || 'auto' }}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  )
}

export default Collapse
