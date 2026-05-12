export type RawPet = {
  title: string;
  description: string;
  url: string;
  created: string;
};

export type Pet = RawPet & {
  id: string;
  createdAt: string;
  createdTimestamp: number;
  fileName: string;
  sizeBytes: number;
  sizeSource: "estimated" | "remote";
};

export type NameSort = "name-asc" | "name-desc";

export type DateSort = "date-desc" | "date-asc";

export type SortBy = "name" | "date";

export type DataStatus = "idle" | "loading" | "success" | "error";
