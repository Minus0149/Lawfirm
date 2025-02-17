import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createCache<T>(maxSize = 100) {
  const cache = new Map<string, { data: T; timestamp: number }>();
  return {
    get: (key: string) => {
      const item = cache.get(key);
      if (item && Date.now() - item.timestamp < 60000) { // 1 minute cache
        return item.data;
      }
      return null;
    },
    set: (key: string, data: T) => {
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value as string;
        cache.delete(oldestKey);
      }
      cache.set(key, { data, timestamp: Date.now() });
    },
  };
}

export function bufferToBase64(buffer: Buffer | null): string {
  if (!buffer) return ""
  return `data:image/jpeg;base64,${buffer.toString("base64")}`
}
