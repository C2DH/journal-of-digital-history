/**
 * Converts a string cell value into a clickable button if it is a valid URL.
 * The button displays the main domain of the URL and opens the link in a new tab when clicked.
 * If the input is not a valid URL, returns the original string.
 *
 * @param cell - The string value to be checked and potentially converted into a link button.
 * @returns A React button element displaying the main domain if the input is a valid URL, otherwise the original string.
 */
export const convertLink = (cell: string) => {
  try {
    const url = new URL(cell)
    const mainDomain = url.hostname.split('.').slice(-2, -1)[0]
    return (
      <button type="button" onClick={() => window.open(cell, '_blank')} className="link-button">
        {mainDomain}
      </button>
    )
  } catch {
    return cell
  }
}
