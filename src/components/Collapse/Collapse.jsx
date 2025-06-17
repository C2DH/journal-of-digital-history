import { useState, useLayoutEffect, useRef } from 'react'; 
import { Plus, Minus } from 'iconoir-react'
import { ArrowUpCircle, ArrowDownCircle } from 'react-feather';

import styles from './Collapse.module.css';


const Collapse = ({
  collapsable = false,
  collapsed = false,
  children,
}) => {

  const [isCollapsed, setCollapsed] = useState(collapsed);
  const ref = useRef();

  const onIconClickHandler = () => { 
    setCollapsed(!isCollapsed);
  }

  return (
    <div className={styles.Collapse}>
      {collapsable &&
        <button onClick={onIconClickHandler} className={styles.icon}>
            {isCollapsed ? 
              <Plus size="28" strokeWidth="1" /> : 
              <Minus size="28" strokeWidth="1" />
            }
        </button>
       }

      <div
        className = {`${styles.collapse_box}`}
        style     = {{ height: isCollapsed ? 0 : ref.current?.offsetHeight || 'auto' }}
      >
        <div ref={ref}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Collapse;