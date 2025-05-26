/**
 * Fetches items from the specified URL using the Fetch API.
 *
 * @param url - The endpoint from which to fetch data.
 * @returns A promise that resolves to the parsed JSON response.
 * @throws Will throw an error if the network response is not ok.
 */
export async function fetchItems(url: string, username?: string, password?: string) {
  const credentials = btoa(`${username}:${password}`) || ''
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`)
  }
  return response.json()
}
