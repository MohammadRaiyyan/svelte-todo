export type Task = {
  id: string;
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  dueAt?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
};
export type Status = "done" | "todo" | "in-progress";
export type Priority = "Normal" | "Low" | "Medium" | "High";
export type Filter = { status: Status | "all"; priority: Priority | "all" };
export type SortBy = "createdAt" | "title" | "status" | "priority";
export type Option<T> = {
  value: T;
  label: string;
  color?: string;
  sort?: number;
};
export type Action = "done" | "todo" | "remove" | "edit" | "view" | "create" | "close" | "update";
