/**
 * Checks if a given GitHub username exists by making a request to the back-end /api/check-github-id/:username
 *
 * @param githubId - The GitHub username to check.
 * @returns A promise that resolves to `true` if the username exists, or `false` otherwise.
 * @throws Logs an error to the console if the fetch request fails.
 */
const checkGithubUsername = async (githubId: string) => {
  const url = `${import.meta.env.VITE_GITHUB_USERS_API_ENDPOINT}${githubId}`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })
    console.info('[GithubAPI] Username response:', response)

    if (response.status == 200) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('[GithubAPI] Error checking GitHub username:', error)
  }
}

export default checkGithubUsername
