import { ColorPalette } from './constant'

export const generateColorList = (seed, colors = ColorPalette) => {
  // Use the seed to generate a deterministic list of colors
  const seedInt = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const numColors = Math.floor(seedInt % 3) + 1
  const colorList = []
  // Shuffle the colors array using the seed
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor((seedInt * (i + 1)) % colors.length)
    ;[colors[i], colors[j]] = [colors[j], colors[i]]
  }

  // Pick the first `numColors` colors from the shuffled colors array
  for (let i = 0; i < numColors; i++) {
    colorList.push(colors[i] as never)
  }

  const bandWidths = []
  const averageWidth = Math.floor(100 / numColors)
  const minWidth = Math.max(0, averageWidth - 5)
  const maxWidth = Math.min(averageWidth + 5, 100)

  let remainingWidth = 100
  // Calculate the band percent widths based on the seed
  for (let i = 0; i < numColors - 1; i++) {
    // bandwidth is a random number between minWidth and maxWidth. use Math.random() instead of seedInt to get a different result each time
    const bandWidth = Math.floor(Math.random() * (maxWidth - minWidth) + minWidth)
    bandWidths.push(bandWidth as never)
    remainingWidth -= bandWidth
  }
  bandWidths.push(remainingWidth as never)
  let previousWidth = 0
  const gradientBands = bandWidths.map((width, i) => {
    previousWidth += width
    return `${colorList[i]} ${previousWidth - width}% ${previousWidth}%`
  })
  const gradient = `linear-gradient(to right, ${gradientBands.join(', ')})`
  return gradient
}
