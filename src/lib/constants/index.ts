import type { Option, Priority, SortBy, Status } from "../../types/task";

export const taskStatusOptions: Option<Status | "all">[] = [
  { value: "all", label: "All", color: "blue", sort: 0 },
  { value: "todo", label: "Todo", color: "blue", sort: 1 },
  { value: "done", label: "Done", color: "green", sort: 2 },
  { value: "in-progress", label: "In Progress", color: "orange", sort: 3 },
];

export const taskPriorityOptions: Option<Priority>[] = [
  { value: "Normal", label: "Normal", color: "teal", sort: 1 },
  { value: "Low", label: "Low", color: "gray", sort: 2 },
  { value: "Medium", label: "Medium", color: "orange", sort: 3 },
  { value: "High", label: "High", color: "red", sort: 4 },
];

export const taskSortOptions: Option<SortBy>[] = [
  { value: "title", label: "Title" },
  { value: "status", label: "Status" },
  { value: "createdAt", label: "Creation Time" },
];
