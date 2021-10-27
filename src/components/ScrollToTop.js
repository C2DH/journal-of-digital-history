import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToElementById } from '../logic/viewport'


const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();
  // for shadow hermeneutic layer
  useEffect(() => {
    let timer
    const qs = new URLSearchParams(search)
    const idx = qs.get('idx')
    clearTimeout(timer)
    if (!isNaN(idx)) {
      timer = setTimeout(() => {
        scrollToElementById('C-' + idx)
      }, 0);
    }
    return () => {
      clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    let timer;
    if (hash === '') {
      window.scrollTo(0, 0)
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const id = hash.replace('#', '')
        scrollToElementById(id)
      }, 0);
    }
    return () => {
      clearTimeout(timer)
    }
  }, [pathname, hash])

  return null;
}

export default ScrollToTop
