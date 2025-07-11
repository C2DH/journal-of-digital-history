import { useEffect, useState } from 'react'

/**
 * Custom React hook that returns a debounced version of a value.
 * The debounced value only updates after the specified delay has passed
 * since the last change to the input value.
 *
 * @typeParam T - The type of the value to debounce.
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}
