<script lang="ts">
  import type { Filter, Task } from "./types/task";
  import TaskForm from "./lib/TaskForm.svelte";
  import Tasks from "./lib/Tasks.svelte";
  import ZeroState from "./lib/ZeroState.svelte";
  import { localStore } from "./lib/services/localStore.svelte";

  let tasks = localStore<Task[]>("tasks", []);
  let createTask = $state(false);

  let currentFilter = $state<Filter>("all");
  let doneTaskCount = $derived(
    tasks.value.reduce((acc, curr) => acc + Number(curr.status === "Done"), 0)
  );
  let filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "all":
        return tasks.value;
      case "done":
        return tasks.value.filter((task) => task.status === "Done");
      case "todo":
        return tasks.value.filter((task) => task.status === "Todo");
      default:
        return tasks.value;
    }
  });

  function handleDone(task: Task) {
    task.status = task.status === "Done" ? "Todo" : "Done";
  }

  function handleRemove(id: string) {
    const index = tasks.value.findIndex((task) => task.id === id);
    tasks.value.splice(index, 1);
  }

  function addTask(task: Task) {
    tasks.value.push(task);
    createTask = false;
  }
  function handleUpdate(task: Task) {
    tasks.value = tasks.value.map((t: Task) => {
      if (t.id === task.id) {
        return task;
      }
      return t;
    });
  }
  function handleClose() {
    createTask = false;
  }
</script>

<main class="container">
  <article class="header-nav">
    <header class="nav">
      <div>Svelte Task</div>
      <button aria-label="Add task" onclick={() => (createTask = true)}>
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
          <path d="M16 5l3 3" />
        </svg>
      </button>
    </header>
  </article>
  <TaskForm {addTask} isOpen={createTask} {handleClose} {handleUpdate} />
  <section class="task-container">
    {#if tasks.value.length > 0}
      <div class="header">
        <div role="group">
          <button class="filter" onclick={() => (currentFilter = "all")}>All</button>
          <button class="filter secondary" onclick={() => (currentFilter = "todo")}>Todo</button>
          <button class="filter secondary" onclick={() => (currentFilter = "done")}>Done</button>
        </div>
        <p class="task-done-count">
          <span>{doneTaskCount}</span> / <span>{tasks.value.length}</span> tasks completed
        </p>
      </div>
      <div class="tasks">
        <Tasks
          {handleUpdate}
          filter={currentFilter}
          tasks={filteredTasks}
          {handleDone}
          {handleRemove}
        />
      </div>
    {:else}
      <ZeroState />
    {/if}
  </section>
</main>

<style>
  .container {
    max-width: 600px;
    height: calc(100vh - 20px);
    overflow: hidden;
  }

  .header-nav {
    padding-bottom: 0;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
  }

  .nav button {
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .filter {
    width: max-content;
  }

  .task-container {
    height: calc(100vh - 62px);
    overflow-y: hidden;
  }

  .tasks {
    height: calc(100vh - 140px);
    overflow-y: auto;
    padding-bottom: 80px;
  }

  .task-done-count {
    font-size: 0.775rem;
    text-align: end;
  }
</style>
