/**
 * Debounces a function call, ensuring that it is not called again until after a specified delay.
 *
 * @param {string} path - The arguments to be passed to the function.
 * @param {number} delay - The delay in milliseconds before the function is called.
 * @param {func} func - The function to be debounced.
 * @returns {void} 
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
