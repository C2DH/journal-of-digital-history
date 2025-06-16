import { useState, useLayoutEffect, useRef } from 'react'; 
import { ArrowUpCircle, ArrowDownCircle } from 'react-feather';

import styles from './Collapse.module.css';


const Collapse = ({
  className = '',
  collapsable = false,
  children,
}) => {

  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef();

  useLayoutEffect(() => {
    if (ref.current) {
      // Set initial height to 0 to get the correct scrollHeight
      // When children change (tag filters), we need to reset the height
      // The transition has to be removed to get the correct height
      if (collapsable) {
        ref.current.style.transition = 'unset';
        ref.current.style.height = '0';
      }

      ref.current.style.height = !collapsable ? 'auto' : collapsed ? 0 : `${ref.current.scrollHeight}px`;
      ref.current.style.removeProperty('transition');
    }
  }, [children, collapsable, collapsed]);

  const onIconClickHandler = () => { 
    setCollapsed(!collapsed);
  }

  return (
    <div className={styles.Collapse}>
      {collapsable &&
        <button onClick={onIconClickHandler} className={styles.icon}>
            {collapsed ? 
              <ArrowDownCircle size="28" strokeWidth="1" /> : 
              <ArrowUpCircle size="28" strokeWidth="1" />
            }
        </button>
       }

      <div
        ref       = {ref}
        className = {`${className} ${styles['collapse-box']}`}
      >
        {children}
      </div>
    </div>
  )
}

export default Collapse;