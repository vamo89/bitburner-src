import { RunningScript } from "../../Script/RunningScript";

interface PinnedWindow {
  id: string;
  script: RunningScript;
}

class PinnedWindowsManagerClass {
  private pinnedWindows: Map<string, PinnedWindow> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Pin a script window to the sidebar
   */
  pinWindow(script: RunningScript): void {
    const id = script.pid.toString();
    this.pinnedWindows.set(id, { id, script });
    this.notifyListeners();
  }

  /**
   * Unpin a script window from the sidebar
   */
  unpinWindow(id: string): void {
    this.pinnedWindows.delete(id);
    this.notifyListeners();
  }

  /**
   * Get all pinned windows
   */
  getPinnedWindows(): PinnedWindow[] {
    return Array.from(this.pinnedWindows.values());
  }

  /**
   * Check if a window is pinned
   */
  isPinned(id: string): boolean {
    return this.pinnedWindows.has(id);
  }

  /**
   * Subscribe to changes in pinned windows
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Clear all pinned windows
   */
  clearAll(): void {
    this.pinnedWindows.clear();
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const PinnedWindowsManager = new PinnedWindowsManagerClass();
