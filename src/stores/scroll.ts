import { createSignal } from "solid-js";

export type ScrollKey = string;

type ScrollState = Readonly<Record<ScrollKey, number>>;

const [positions, setPositions] = createSignal<ScrollState>({});

/**
 * Global scroll position store.
 *
 * Usage:
 * - scroll.get("home")
 * - scroll.set("home", window.scrollY)
 * - scroll.clear("home")
 * - scroll.clearAll()
 */
const scroll = {
  /**
   * Returns the last saved scrollY for a key.
   * If none exists, returns `fallback` (default `0`).
   */
  get(key: ScrollKey, fallback = 0): number {
    const value = positions()[key];
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
  },

  /**
   * Saves a scrollY for a key (clamped to >= 0).
   */
  set(key: ScrollKey, y: number): void {
    const next = Number.isFinite(y) ? Math.max(0, y) : 0;
    setPositions((prev) => {
      if (prev[key] === next) return prev;
      return { ...prev, [key]: next };
    });
  },

  clear(key: ScrollKey): void {
    setPositions((prev) => {
      if (!(key in prev)) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  },

  clearAll(): void {
    setPositions({});
  },

  positions,
} as const;

export default scroll;
