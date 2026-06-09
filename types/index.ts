export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "video" | "about";
  children?: FileItem[];
  duration?: string;
  year?: string;
  client?: string;
  vimeoId?: string;
  youtubeId?: string;
  ratio?: "16/9" | "1/1" | "4/5" | "9/16";
  thumbnail?: string | null;
  content?: string;
};

export type BreadcrumbItem = {
  id: string;
  name: string;
};
