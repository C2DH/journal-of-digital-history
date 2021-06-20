import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timeoutId = null
    let timer;
    if (hash=== '') {
      window.scrollTo(0, 0)
    } else {
      clearTimeout(timeoutId);
      timer = setTimeout(() => {
        const id = hash.replace('#', '')
        console.info('ScrollTo', id)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
    return () => {
      clearTimeout(timer)
    }
  }, [pathname, hash])

  return null;
}

export default ScrollToTop
