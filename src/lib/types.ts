export type LanEvent = {
  id: string;
  title: string;
  date: string; // ISO format
  location?: string;
  description?: string;
  coverImage?: string;
};
