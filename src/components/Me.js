import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetJSON } from '../logic/api/fetchData'
import '../styles/components/Me.css'

/** array of nice colors */
const ColorPalette = [
  '#FFB6C1', // LightPink
  '#FFC0CB', // Pink
  '#FF69B4', // HotPink
  '#8B008B', // DarkMagenta
  '#800080', // Purple
  '#C71585', // MediumVioletRed
  '#FFA07A', // LightSalmon
  '#FA8072', // Salmon
  '#E9967A', // DarkSalmon
  '#FF8C00', // DarkOrange
  '#FFA500', // Orange
  '#FFD700', // Gold
  '#DAA520', // GoldenRod
  '#FFEF96', // Khaki
  '#F0E68C', // KhakiLight
  '#EEE8AA', // PaleGoldenRod
  '#BDB76B', // DarkKhaki
  '#F08080', // LightCoral
  '#CD5C5C', // IndianRed
  '#FFDAB9', // PeachPuff
  '#FFE4B5', // Moccasin
  '#FAFAD2', // LightGoldenRodYellow
  '#FFF8DC', // Cornsilk
  '#D91E2E', // Red
  '#F2EFE9',
  '#F28705',
  '#F24C27',
  '#0896A6',
  '#0E5CAD',
  '#68A694',

  '#F2EFE9',
  '#F28705',
]

const generateColorList = (seed, colors = ColorPalette) => {
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
    colorList.push(colors[i])
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
    bandWidths.push(bandWidth)
    remainingWidth -= bandWidth
  }
  bandWidths.push(remainingWidth)
  let previousWidth = 0
  const gradientBands = bandWidths.map((width, i) => {
    previousWidth += width
    return `${colorList[i]} ${previousWidth - width}% ${previousWidth}%`
  })
  const gradient = `linear-gradient(to right, ${gradientBands.join(', ')})`
  return gradient
}

/**
 * React component that loads the username from the rest url /api/me.
 * If the request succeeds, the components render the user first_name and username.
 * If the request fails, the component silently fails.
 * @return {React.Component} The component.
 */
const Me = () => {
  const { t } = useTranslation()
  const { data, error } = useGetJSON({
    url: '/api/me',
  })
  console.debug('[Me]', error, data)
  if (error) return null
  if (!data) return null
  return (
    <div className="Me">
      <div>
        {t('welcomeBack')}
        <a href="/admin" title={data.username}>
          {data.first_name.length ? data.first_name : data.username}
        </a>
        <div className="Me_avatar" style={{ background: generateColorList(data.username) }}></div>
      </div>
    </div>
  )
}

export default Me
