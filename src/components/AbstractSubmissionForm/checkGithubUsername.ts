/**
 * Checks if a given GitHub username exists by making a request to the GitHub Users API.
 *
 * @param githubId - The GitHub username to check.
 * @returns A promise that resolves to `true` if the username exists, or `false` otherwise.
 * @throws Logs an error to the console if the fetch request fails.
 */
const checkGithubUsername = async (githubId: string) => {
  const url = `${process.env.REACT_APP_GITHUB_USERS_API_ENDPOINT}${githubId}`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`, 
        
      },
    });
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
