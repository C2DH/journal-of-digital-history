export const randomFakeSentence = (num) => {
  let t = '▤'
  const characters = ' .!,◎,;▤▤ ▫▫◮◪ ◍◘◎▚▤'

  const charactersLength = characters.length
  for (let i = 0; i < num; i++) {
    t += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return t
}
