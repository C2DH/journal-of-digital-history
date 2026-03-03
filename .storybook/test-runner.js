export default {
  async preVisit(page) {
    await page.evaluate(() => {
      window.mockImages = true
    })
  },
}
