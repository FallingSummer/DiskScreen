import type { LogEntry } from './LogEntry';

export class LogStorage {
  private readonly storageKey = 'DataScreenPractice.Logs';
  private readonly maxEntries = 100;

  save(entry: LogEntry): void {
    if (typeof window === 'undefined') {
      return;
    }

    const entries = this.readAll();
    entries.push(entry);
    const limitedEntries = entries.slice(-this.maxEntries);
    window.localStorage.setItem(this.storageKey, JSON.stringify(limitedEntries));
  }

  readAll(): LogEntry[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as LogEntry[];
    } catch {
      return [];
    }
  }
}
