/**
 * Return btoa of a ntwork url
 * @returns base64 string
 */
export const encodeNotebookUrl = (url) => window.btoa(encodeURIComponent(url))

/**
 * Decode a Buffer encoded version of a notebook url to an actual url
 * @param {String} url
 * @returns url
 */
export const decodeNotebookUrl = (encodedUrl) => decodeURIComponent(window.atob(encodedUrl))

/**
 * Given a notebook url, return the url to the raw version of the notebook
 * @param {String} url
 * @returns url to raw notebook
 */
export const getRawNotebookUrl = (url) => {
  // transform url only if it is a raw github url
  const isGithub = url.match(
    /https?:\/\/(github\.com|raw\.githubusercontent\.com)\/([A-Za-z0-9-_.]+)\/([A-Za-z0-9-_.]+)\/(blob\/)?(.*)/,
  )
  if (isGithub) {
    const [, , username, repo, , filepath] = isGithub
    const rawUrl = `/proxy-githubusercontent/${username}/${repo}/${filepath}`
    return rawUrl
  }
  // if it's mybinder or colab
  const isJupyter = url.match(
    /https:\/\/(mybinder.org|colab.research.google.com)\/(v2\/)?(gh\/)?([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)\/(.*)/,
  )
  if (isJupyter) {
    const [, domain, , , username, repo, filepath] = isJupyter
    const rawUrl = `https://${domain}/gh/${username}/${repo}/raw/${filepath}`
    return rawUrl
  }
  return url
}
