import {
  createMemo,
  createSignal,
  For,
  Show,
  type VoidComponent,
} from "solid-js";
import { getPreviewUrl } from "../api/cdn";
import { A } from "@solidjs/router";
import videos from "../stores/videos";
import type { Video } from "../api/videos/type";
import LucideGithub from "~icons/lucide/github";
import VirtualGrid from "../components/VirtualGrid";

const Preview: VoidComponent<Video> = (video) => {
  const [loaded, setLoaded] = createSignal(false);

  return (
    <A
      href={`/videos/${video.id}`}
      class="group rd-2xl hover:scale-105 transition-transform bg-#181919 overflow-hidden border-white/15 border flex flex-col w-400px"
    >
      <div class="relative h-200px">
        <div class="group-hover:opacity-100 transition-opacity opacity-0 bg-gradient-to-t from-black/50 to-transparent z-5 absolute inset-0"></div>
        <Show when={!loaded()}>
          <div class="absolute inset-0 bg-white/5 animate-pulse duration-300 z-0" />
        </Show>
        <img
          src={getPreviewUrl(video)}
          class={`object-cover h-full w-full z-0 transition-opacity duration-300 ${
            loaded() ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div class="flex flex-col gap-1 px-4 py-3">
        <p class="font-serif">{video.title}</p>
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <div class="bg-#464747 text-2 font-500 rd-full size-20px flex items-center justify-center">
              {video.authorName[0]}
            </div>
            <p class="opacity-50 text-xs">{video.authorName}</p>
            <p class="bg-#2B2C2C text-#808080 font-500 text-xs px-1.5 py-.5 rd-full">
              {video.category}
            </p>
          </div>
        </div>
      </div>
    </A>
  );
};

export default function View() {
  const [filters, setFilters] = createSignal<Array<string>>([]);

  const filtered = createMemo(() => {
    if (filters().length === 0) return videos.everything;
    return videos.everything.filter((video) =>
      filters().includes(video.category),
    );
  });

  const toggle = (category: string): void => {
    if (filters().includes(category)) {
      setFilters((prev) => prev.filter((curr) => curr !== category));
    } else {
      setFilters((prev) => [...prev, category]);
    }
  };

  return (
    <div class="flex flex-col p-16 pt-24 gap-8">
      <div class="flex flex-col">
        <div class="flex gap-8 items-center">
          <h1 class="text-11 font-500 font-serif">Explore Wallper Library</h1>
          <a
            href="https://github.com/Vexcited/WallperViewer"
            target="_blank"
            class="text-2xl"
          >
            <LucideGithub />
          </a>
        </div>
        <p class="text-sm opacity-50">
          Discover {videos.everything.length} stunning live wallpapers curated
          for your desktop.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <For each={videos.categories}>
          {(category) => (
            <button
              class="rd-full px-2.5 py-1 text-sm transition-colors cursor-pointer"
              type="button"
              onClick={() => toggle(category)}
              classList={{
                "bg-white/10 hover:bg-white/15": !filters().includes(category),
                "bg-white text-black": filters().includes(category),
              }}
            >
              {category}
            </button>
          )}
        </For>
      </div>

      <VirtualGrid
        scrollKey="home"
        items={filtered()}
        itemHeight={274}
        itemWidth={400}
        gap={24}
        fallback={
          <div class="w-full text-center opacity-50 py-10 absolute top-0 left-0">
            No wallpapers found
          </div>
        }
      >
        {(video) => <Preview {...video} />}
      </VirtualGrid>
    </div>
  );
}
