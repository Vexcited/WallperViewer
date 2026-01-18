import { A, Navigate, useNavigate, useParams } from "@solidjs/router";
import {
  createMemo,
  Show,
  type FlowComponent,
  createSignal,
  createEffect,
} from "solid-js";
import videos from "../../stores/videos";
import { getVideoUrl, getPreviewUrl } from "../../api/cdn";
import LucideDownload from "~icons/lucide/download";
import LucideChevronLeft from "~icons/lucide/chevron-left";
import LucideLoader2 from "~icons/lucide/loader-2";

const Box: FlowComponent = (props) => (
  <div class="bg-black/10 backdrop-blur-md px-1.5 py-1 rd-md border border-white/10 text-white/80 font-mono text-xs">
    {props.children}
  </div>
);

export default function View() {
  const params = useParams<{ id: string }>();
  const [isVideoLoaded, setIsVideoLoaded] = createSignal(false);

  const video = createMemo(() =>
    videos.everything.find((video) => video.id === params.id),
  );

  createEffect(() => {
    video();
    setIsVideoLoaded(false);
  });

  return (
    <Show
      when={video()}
      fallback={
        videos.loading ? (
          <div class="h-screen w-screen flex items-center justify-center">
            <LucideLoader2 class="animate-spin text-white/50 size-12" />
          </div>
        ) : (
          <Navigate href="/" />
        )
      }
    >
      {(video) => (
        <div class="relative h-screen">
          <img
            src={getPreviewUrl(video())}
            class="fixed inset-0 h-full w-full object-cover z-0 animate-pulse"
            alt={`Preview of ${video().title}`}
          />

          <video
            autoplay
            muted
            loop
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0) setIsVideoLoaded(true);
            }}
            class={`fixed inset-0 h-full w-full object-cover pointer-events-none z-5 transition-opacity duration-500 ${
              isVideoLoaded() ? "opacity-100" : "opacity-0"
            }`}
            src={getVideoUrl(video())}
          />

          <A
            href="/"
            class="z-20 bg-black/35 hover:bg-black/30 transition-colors backdrop-blur-md size-10 flex items-center justify-center rd-full mt-2 border border-white/25 fixed top-4 left-6 cursor-pointer"
          >
            <LucideChevronLeft />
          </A>

          <div
            class="fixed inset-x-0 bottom-0 h-25% z-5 backdrop-blur-md"
            style={{
              "mask-image": "linear-gradient(to top, white 50%, transparent)",
            }}
          ></div>
          <div class="fixed bg-black/25 to-transparent inset-0 z-5"></div>
          <div class="fixed bg-gradient-to-t from-black/50 to-50% to-transparent inset-0 z-5"></div>

          <div class="fixed inset-0 flex justify-center items-center flex-col z-10 gap-2">
            <h1 class="text-6xl font-serif">{video().title}</h1>
            <p class="uppercase tracking-1 opacity-75">{video().category}</p>

            <div class="flex gap-2 mt-6">
              <Box>Author: {video().authorName}</Box>
              <Box>Size: {video().fileSizeMb.toFixed(1)} mb</Box>
              <Box>Resolution: {video().resolution}</Box>
              <Box>Likes: {video().likes}</Box>
            </div>

            <a
              class="flex items-center gap-2 bg-black/15 hover:bg-black/5 transition-colors backdrop-blur-md px-4 py-2 rd-full mt-2 border border-white/10"
              href={getVideoUrl(video())}
              target="_blank"
            >
              <LucideDownload /> Video
            </a>
          </div>
        </div>
      )}
    </Show>
  );
}
