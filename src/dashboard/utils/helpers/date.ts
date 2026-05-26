import { DateTime } from 'luxon'

/**
 * Converts an ISO date string to a formatted date string (e.g., '25 Dec 2023').
 * @param date - The ISO date string to convert.
 * @returns The formatted date string.
 */
export const convertDate = (date) => {
  return DateTime.fromISO(date).toFormat('dd MMM yyyy')
}

/**
 * Converts an ISO date string to a formatted date string (e.g., 'Apr 27, 2026, 9:40 AM').
 * @param date - The ISO date string to convert.
 * @returns The formatted date string.
 */
export const convertDateWithHour = (date) => {
  return DateTime.fromISO(date).toFormat('ff')
}
