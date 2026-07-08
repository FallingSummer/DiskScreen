export function debounce<T extends (...args: never[]) => void>(callback: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: never[]) => void>(callback: T, wait = 300) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      callback(...args);
    }
  };
}
