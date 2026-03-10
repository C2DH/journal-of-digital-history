/**
 * Parse a raw "tweets.md" content and extract tweet paragraphs.
 *
 * Behavior:
 * - Removes a leading "Post thread:" header (case-insensitive).
 * - Collects numbered thread items (e.g. "1. text") into an ordered list.
 * - Collects independent bullet items (lines starting with "-") separately.
 * - Ignores empty lines and trims whitespace.
 * - If numbered lines appear without an explicit "Post thread:" header, they're still treated as a thread.
 *
 * @param raw - Raw multi-line string (e.g. content of tweets.md)
 * @returns string[] - Array of tweet strings: thread items first (in order), then independent items.
 */

const cleanThreadContent = (raw: string): string[] => {
  if (!raw) return []

  const lines = raw.replace(/\r/g, '').split('\n')
  const threadTexts: string[] = []
  const independent: string[] = []
  let mode: 'thread' | 'independent' | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    // "Post thread:" header
    if (/^Post thread:/i.test(line)) {
      mode = 'thread'
      continue
    }

    // Line number 1., 2., 3. etc...
    if (mode === 'thread') {
      const m = line.match(/^\d+\.\s*(.*)$/)
      if (m) {
        threadTexts.push(m[1].trim())
        continue
      }
      threadTexts.push(line.replace(/^\d+\.\s*/, '').trim())
      continue
    }

    // Independent bullet items
    if (line.startsWith('-')) {
      mode = 'independent'
      independent.push(line.replace(/^-+\s*/, '').trim())
      continue
    }

    // If no header but line is numbered, treat it as thread
    if (/^\d+\.\s*/.test(line)) {
      mode = 'thread'
      threadTexts.push(line.replace(/^\d+\.\s*/, '').trim())
      continue
    }

    // Fallback: treat plain lines as independent items
    independent.push(line)
  }

  // Return combined list: thread first, then independent
  return [...threadTexts, ...independent]
}

export { cleanThreadContent }
