export type Task = {
  id: string;
  title: string;
  content: string;
  status: Status;
};
export type Status = "done" | "todo" | "in-progress";
export type Filter = "all" | Status;
export type Option<T> = {
  value: T;
  label: string;
  color?: string;
  sort?: number;
};
export type Action = "done" | "todo" | "remove" | "edit" | "view" | "create" | "close" | "update";
