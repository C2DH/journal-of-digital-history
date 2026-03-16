import DOMPurify from 'dompurify'

/**
 * Remove escape characters from a string.
 * Handles: \", \', \\, \n, \r, \t, \0
 */
export const removeEscapeCharacters = (value: string): string => {
  return value
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\0/g, '')
}

/**
 * Sanitize a string by:
 * 1. Stripping all HTML tags, scripts, and dangerous content
 * 2. Removing escape characters
 */
export const sanitizeInput = (value: string): string => {
  const stripped = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
  })
  return stripped
}

/**
 * Sanitize all string values in a form data object.
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data }
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key] as string) as T[Extract<keyof T, string>]
    }
  }
  return sanitized
}
