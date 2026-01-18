import { createMemo, createResource, createRoot } from "solid-js";
import type { Video } from "../api/videos/type";
import { get_videos_official } from "../api/videos/official";
import { get_videos_user_generated } from "../api/videos/user-generated";

export default createRoot(() => {
  const [official] = createResource(get_videos_official);
  const [generated] = createResource(get_videos_user_generated);

  const loading = createMemo(() => official.loading || generated.loading);

  const videos = createMemo(() => {
    let output: Array<Video> = [];

    if (!generated.loading) {
      output = generated()!;
    }

    if (!official.loading) {
      output = output.concat(official()!);
    }

    return output.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  const categories = createMemo(() =>
    Array.from(new Set(videos().map((video) => video.category))),
  );

  return {
    get categories() {
      return categories();
    },
    get official() {
      return official() ?? [];
    },
    get generated() {
      return generated() ?? [];
    },
    get everything() {
      return videos();
    },
    get loading() {
      return loading();
    },
  };
});
