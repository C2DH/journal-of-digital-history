import { Abstract } from '../types'
/**
 * Finds the contact email for a given abstract ID and sets it using the provided setter.
 *
 * @param id - The abstract's PID to search for.
 * @param data - Array of Abstract objects to search within.
 * @param setEmail - Callback to set the found contact email.
 */
export function retrieveContactEmail(
  id: string = '',
  data: Abstract[],
  setEmail: (email: string) => void,
) {
  data.forEach((row) => {
    if (row.pid === id) {
      setEmail(row.contact_email)
    }
  })
}

/**
 * Set up the body of the email in the the contact form properly by replacing placeholders in the template with actual data from the abstract.
 *
 * @param template - The template for the body from the translation.json file.
 * @param data - The abstract data to replace the placeholders with recipient name, submission title, submission ID, contact email, and signature.
 * @return The formatted body email with all placeholders replaced with actual data.
 */
export function formatMessage(template, data) {
  return template
    .replace(/\{recipientName\}/g, data?.row[2] || 'author')
    .replace(/\{submissionTitle\}/g, data?.title)
    .replace(/\{submissionId\}/g, data?.id)
    .replace(/\{contactEmail\}/g, 'jdh.admin@uni.lu')
    .replace(/\{signature\}/g, 'JDH Team')
}
