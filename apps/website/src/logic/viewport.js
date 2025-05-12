export const setBodyNoScroll = (noscroll) => {
  document.body.classList.toggle('noscroll', noscroll)
}

export const scrollToElementById = (id) => {
  console.info('scrollToElementById', id)
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView()
  }
}

export const debounce = (fn, ms, deps) => {
  let timer
  return (event) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn(event, deps)
    }, ms)
  }
}
