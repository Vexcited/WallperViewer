import { json } from "../call";
import type { Video } from "./type";

export const get_videos_video_metadata = (id: string): Promise<Video> =>
  json("GET", `/videos/video-metadata/${id}`);
