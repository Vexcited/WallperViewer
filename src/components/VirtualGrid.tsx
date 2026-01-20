import {
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from "solid-js";

export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  gap: number;
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

  onMount(() => {
    const handleScroll = () => setScrollY(window.scrollY);
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