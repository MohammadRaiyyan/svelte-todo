export type Task = {
  id: string;
  title: string;
  content: string;
  status: "Done" | "Todo";
};
export type Filter = "all" | "done" | "todo";
