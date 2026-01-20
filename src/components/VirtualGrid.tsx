import {
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  createEffect,
  type JSX,
} from "solid-js";
import scroll from "../stores/scroll";

export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  gap: number;

  /**
   * Optional key used to persist/restore scroll position (window.scrollY)
   * across navigations (e.g. home -> detail -> home).
   */
  scrollKey?: string;

  children: (item: T) => JSX.Element;
  fallback?: JSX.Element;
}

export default function VirtualGrid<T>(props: VirtualGridProps<T>) {
  let containerRef: HTMLDivElement | undefined;
  const [containerWidth, setContainerWidth] = createSignal(0);
  const [windowHeight, setWindowHeight] = createSignal(
    typeof window !== "undefined" ? window.innerHeight : 0,
  );
  const [scrollY, setScrollY] = createSignal(0);

  // Restore scroll position on mount (best-effort). We do it in onMount so the DOM exists.
  onMount(() => {
    const key = props.scrollKey;
    if (key && typeof window !== "undefined") {
      const saved = scroll.get(key, 0);
      if (Number.isFinite(saved)) {
        // Use rAF to avoid restoring too early while layout is still settling.
        requestAnimationFrame(() => window.scrollTo(0, saved));
      }
    }

    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      const k = props.scrollKey;
      if (k) {
        scroll.set(k, y);
      }
    };

    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    handleScroll();
    handleResize();

    if (containerRef) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(containerRef);
      onCleanup(() => observer.disconnect());
    }

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    });
  });

  // If the dataset changes (filters/search), keep the saved scroll position sane.
  createEffect(() => {
    props.items.length;
    const key = props.scrollKey;
    if (!key) return;

    // After list changes, clamp any saved scrollY to current max scroll.
    queueMicrotask(() => {
      const doc = document.documentElement;
      const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
      const y = Math.min(window.scrollY, maxY);

      scroll.set(key, y);
      if (y !== window.scrollY) window.scrollTo(0, y);
    });
  });

  const columns = createMemo(() => {
    const width = containerWidth();
    if (!width) return 1;
    return Math.max(
      1,
      Math.floor((width + props.gap) / (props.itemWidth + props.gap)),
    );
  });

  const rows = createMemo(() => {
    const cols = columns();
    const list = props.items;
    const result = [];
    for (let i = 0; i < list.length; i += cols) {
      result.push(list.slice(i, i + cols));
    }
    return result;
  });

  const virtualRows = createMemo(() => {
    const y = scrollY();
    const offsetTop = containerRef?.offsetTop || 0;
    const effectiveScrollY = Math.max(0, y - offsetTop);

    const height = windowHeight();
    const allRows = rows();

    const startIndex = Math.floor(effectiveScrollY / props.itemHeight);
    const endIndex = Math.min(
      allRows.length,
      Math.ceil((effectiveScrollY + height) / props.itemHeight),
    );

    const overscan = 2;
    const start = Math.max(0, startIndex - overscan);
    const end = Math.min(allRows.length, endIndex + overscan);

    return {
      items: allRows.slice(start, end),
      start,
      end,
      totalHeight: allRows.length * props.itemHeight,
    };
  });

  return (
    <div
      class="w-full relative"
      ref={containerRef}
      style={{ height: `${virtualRows().totalHeight}px` }}
    >
      <Show when={rows().length > 0} fallback={props.fallback}>
        <div
          class="absolute w-full top-0 left-0 flex flex-col"
          style={{
            transform: `translateY(${
              virtualRows().start * props.itemHeight
            }px)`,
          }}
        >
          <For each={virtualRows().items}>
            {(row) => (
              <div
                class="shrink-0 flex text-left"
                style={{
                  height: `${props.itemHeight}px`,
                  gap: `${props.gap}px`,
                  "margin-bottom": `${props.gap}px`,
                }}
              >
                <For each={row}>{(item) => props.children(item)}</For>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}