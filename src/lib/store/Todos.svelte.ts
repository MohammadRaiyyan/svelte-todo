import { getContext, setContext } from "svelte";
import type { Action, Filter, Task } from "../../types/task";
import { localStore } from "../services/localStore.svelte";
import type { LocalStoreType } from "../services/localStore.svelte";

interface TodosType {
  todos: LocalStoreType<Task[]>;
  showTaskModal: { show: boolean; type: Action; task: Task | null };
  filter: Filter;
  addTodo(task: Task): void;
  removeTodo(id: string): void;
  updateTodo(id: string, task: Task): void;
  setFilter(filter: Filter): void;
  getTasks(): Task[];
  setShowTaskModal(value: boolean, type: Action, task: Task | null): void;
  handleAction(action: Action, task?: Task): void;
  size(): number;
}

class Todos implements TodosType {
  todos = localStore<Task[]>("todos", []);
  showTaskModal = $state<{ show: boolean; type: Action; task: Task | null }>({
    show: false,
    type: "create",
    task: null,
  });
  filter = $state<Filter>("all");

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

  setFilter = (filter: Filter) => {
    this.filter = filter;
  };
  getTasks = () => {
    if (this.filter === "all") return this.todos.value;
    return this.todos.value.filter((task) => task.status === this.filter);
  };

  setShowTaskModal = (value: boolean, type: Action, task: Task | null = null) => {
    console.log(value, type, task);
    this.showTaskModal.show = value;
    this.showTaskModal.type = type;
    this.showTaskModal.task = task;
  };
  handleAction = (action: Action, task?: Task) => {
    if (action === "remove") this.removeTodo(task!.id);
    else if (action === "edit") this.setShowTaskModal(true, "edit", task);
    else if (action === "view") this.setShowTaskModal(true, "view", task);
    else if (action === "create") this.addTodo(task!);
    else if (action === "close") this.setShowTaskModal(false, "create", null);
    else if (action === "update") this.updateTodo(task!.id, task!);
    else this.updateTodo(task!.id, task!);
  };
  size = () => {
    return this.todos.value.length;
  };
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
