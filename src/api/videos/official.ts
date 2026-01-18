import { json } from "../call";
import type { Video } from "./type";

export type VideosOfficial200 = Array<Video>;

export const get_videos_official = (): Promise<VideosOfficial200> =>
  json("GET", "/videos/official");
