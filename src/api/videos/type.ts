export interface Video {
  id: string;
  age: number;
  userId: string | null;
  authorName: string;
  category: string;
  views: number;
  duration: number;
  likes: number;
  resolution: string;
  title: string;
  fileSizeMb: number;
  fileKey: string;
  previewImageKey: string;
  status: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
}
