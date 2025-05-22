export async function fetchIssues() {
  const response = await fetch('/api/issues');
  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.statusText}`);
  }
  return response.json();
}