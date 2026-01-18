import videos from "../stores/videos";
import type { Video } from "./videos/type";

export const getPreviewUrl = (video: Video): string =>
  `https://cdn.wallper.app/previews/${video.previewImageKey}`;

export const getVideoUrl = (video: Video): string => {
  if (videos.official.includes(video)) {
    return `https://cdn.wallper.app/wallper-video/${video.fileKey}`;
  }

  return `https://cdn.wallper.app/wallper-user-generated/${video.fileKey}`;
};
