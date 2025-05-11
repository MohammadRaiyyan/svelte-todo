import type { Option, Status } from "../../types/task";

export const taskStatusOptions: Option<Status | "all">[] = [
  { value: "all", label: "All", color: "indigo", sort: 0 },
  { value: "todo", label: "Todo", color: "indigo", sort: 1 },
  { value: "done", label: "Done", color: "green", sort: 2 },
  { value: "in-progress", label: "In Progress", color: "orange", sort: 3 },
];
