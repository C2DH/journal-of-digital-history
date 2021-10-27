export const setBodyNoScroll = (noscroll) => {
  document.body.classList.toggle('noscroll', noscroll)
}

export const scrollToElementById = (id) => {
  console.info('scrollToElementById', id)
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView();
  }
}
