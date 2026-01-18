import { json } from "../call";

export const macosVersion = "26.2";
export const { applicationLatestVersion: appVersion } = await json<{
  applicationLatestVersion: string;
}>("GET", "/application/status");
