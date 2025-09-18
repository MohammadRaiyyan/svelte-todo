import { getContext, setContext } from "svelte";
import type { Action, Filter, Priority, SortBy, Status, Task } from "../../types/task";
import { localStore } from "../services/localStore.svelte";
import type { LocalStoreType } from "../services/localStore.svelte";

interface TodosType {
  todos: LocalStoreType<Task[]>;

  show: boolean;
  type: Action;

  task: Task | null;

  filter: Filter;
  sort: SortBy;

  addTodo(task: Task): void;
  updateTodo(id: string, task: Task): void;
  removeTodo(id: string): void;

  setFilter(filter: Filter): void;
  getTasks(): Task[];

  setShowTaskModal(value: boolean, type: Action, task: Task | null): void;

  handleAction(action: Action, task?: Task): void;

  size(): number;

  sortBy(sortBy: SortBy): void;
}

class Todos implements TodosType {
  todos = localStore<Task[]>("todos", []);

  show = $state<boolean>(false);
  type = $state<Action>("create");
  task = $state<Task | null>(null);

  filter = $state<Filter>({
    status: "all",
    priority: "all",
  });
  sort = $state<SortBy>("status");

  addTodo = (task: Task) => {
    this.todos.value.push(task);
    this.setShowTaskModal(false, "create", null);
  };

  removeTodo = (id: string) => {
    this.todos.value = this.todos.value.filter((task) => task.id !== id);
  };

  updateTodo = (id: string, task: Task) => {
    this.todos.value = this.todos.value.map((t) => (t.id === id ? task : t));
    this.setShowTaskModal(false, "edit", null);
  };

  setFilter = (filter: Partial<Filter>) => {
    this.filter = { ...this.filter, ...filter };
  };
  getTasks = () => {
    let tasks = [...this.todos.value];

    if (tasks.length === 0) {
      return tasks;
    }

    // 1️⃣ Filter
    if (this.filter.status !== "all") {
      tasks = tasks.filter((task: Task) => task.status === this.filter.status);
    }

    if (this.filter.priority !== "all") {
      tasks = tasks.filter((task: Task) => task.priority === this.filter.priority);
    }

    // 2️⃣ Sort
    if (this.sort === "title") {
      tasks.sort((a: Task, b: Task) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    } else if (this.sort === "status") {
      const order: Record<Status, number> = { todo: 1, "in-progress": 2, done: 3 };
      tasks.sort((a: Task, b: Task) => order[a.status] - order[b.status]);
    } else if (this.sort === "createdAt") {
      tasks.sort((a: Task, b: Task) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (this.sort === "priority") {
      const order: Record<Priority, number> = { Low: 1, Normal: 2, Medium: 3, High: 4 };
      tasks.sort((a: Task, b: Task) => order[a.priority] - order[b.priority]);
    }

    return tasks;
  };

  setShowTaskModal = (value: boolean, type: Action, task: Task | null = null) => {
    console.log(value, type, task);
    this.show = value;
    this.type = type;
    this.task = task;
  };
  handleAction = (action: Action, task?: Task) => {
    if (action === "remove") this.removeTodo(task!.id);
    else if (action === "edit") this.setShowTaskModal(true, "edit", task);
    else if (action === "view") this.setShowTaskModal(true, "view", task);
    else if (action === "create") this.addTodo(task!);
    else if (action === "close") this.setShowTaskModal(false, "create", null);
    else if (action === "update") this.updateTodo(task!.id, task!);
  };
  size = () => {
    return this.todos.value.length;
  };
  sortBy(sort: SortBy) {
    this.sort = sort;
  }
}

const TODOS_KEY = Symbol("_todos_key");

function setTodosContext() {
  const todos = new Todos();
  return setContext(TODOS_KEY, todos);
}
function getTodosContext() {
  return getContext<TodosType>(TODOS_KEY);
}

export { setTodosContext, getTodosContext };
