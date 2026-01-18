import { json } from "../call";
import type { Video } from "./type";

export type VideosUserGenerated200 = Array<Video>;

export const get_videos_user_generated = (): Promise<VideosUserGenerated200> =>
  json("GET", "/videos/user-generated");
