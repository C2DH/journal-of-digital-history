import { Abstract } from '../../utils/types'
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
