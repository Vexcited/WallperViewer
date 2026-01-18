import { appVersion, macosVersion } from "../app/status";
import { json } from "../call";

export interface PostUsersUpsert201 {
  id: string;
  ipAddress: string;
  hwid: string;
  email: string | null;
  userName: string | null;
  licenseId: string | null;
  hasLicense: boolean;
  licenseActivatedAt: string | null;
  deviceName: string;
  deviceType: string;
  macosVersion: string;
  appVersion: string;
  role: "User";
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  firstSeen: string;
  lastSeen: string;
  trialStartedAt: string;
}

export const post_users_upsert = async (
  hwid: string,
  deviceName: string,
  deviceType = "Unknown",
): Promise<PostUsersUpsert201> =>
  json("POST", "/users/upsert", {
    hwid,
    deviceName,
    macosVersion,
    appVersion,
    deviceType,
  });
