export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId); // Clear the previous timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set a new timeout
    };
}