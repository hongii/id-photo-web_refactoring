export default function debounce<T = any>(
  fn: (args: T) => void,
  duration: number
) {
  let timeout: NodeJS.Timeout | null = null;
  return (args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(args);
    }, duration);
  };
}
