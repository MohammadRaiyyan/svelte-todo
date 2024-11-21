<script lang="ts">
  import type { Filter, Task } from "../types/task";
  import ZeroState from "./ZeroState.svelte";
  import { fade } from "svelte/transition";
  import TaskForm from "./TaskForm.svelte";
  import Trash from "./icon/Trash.svelte";
  import Pencil from "./icon/Pencil.svelte";
  import ThreeDot from "./icon/ThreeDot.svelte";
  import ViewTask from "./ViewTask.svelte";

  const {
    tasks,
    handleDone,
    handleRemove,
    filter,
    handleUpdate = () => {},
  }: {
    tasks: Task[];
    handleDone: (task: Task) => void;
    handleRemove: (id: string) => void;
    filter: Filter;
    handleUpdate?: (task: Task) => void;
  } = $props();
  let selectedTask = $state<Task | null>(null);
  let editTask = $state(false);
  let viewTask = $state(false);

  function handleClose() {
    editTask = false;
    selectedTask = null;
  }

  function handleVewTask() {
    viewTask = false;
    selectedTask = null;
  }

  function update(task: Task) {
    handleUpdate(task);
    editTask = false;
  }
</script>

{#if tasks.length > 0}
  {#each tasks as task}
    <div transition:fade>
      <div class="status" class:done={task.status === "Done"}>
        {task.status}
      </div>
      <article class="task">
        <header class="actions">
          <div class="title">
            <input
              type="checkbox"
              class="toggle"
              onchange={() => handleDone(task)}
              checked={task.status === "Done"}
            />
            <div class="line-clamp-1">
              <p>{task.title}</p>
            </div>
          </div>
          <details class="dropdown">
            <summary>
              <ThreeDot />
            </summary>
            <ul>
              <li>
                <button
                  class="btn"
                  aria-label="Edit task"
                  onclick={() => {
                    editTask = true;
                    selectedTask = task;
                  }}
                >
                  <Pencil />
                  Edit
                </button>
              </li>
              <li>
                <button class="btn" aria-label="Remove task" onclick={() => handleRemove(task.id)}>
                  <Trash />
                  Delete
                </button>
              </li>
            </ul>
          </details>
        </header>
        <button
          class="content line-clamp-3"
          onclick={() => {
            viewTask = !viewTask;
            selectedTask = task;
          }}
        >
          {task.content}
        </button>
      </article>
    </div>
  {/each}
{:else}
  <div>
    <ZeroState message={`No ${filter} task found`} />
  </div>
{/if}
<TaskForm {handleClose} handleUpdate={update} isOpen={editTask} task={selectedTask} />
<ViewTask isOpen={viewTask} task={selectedTask} handleClose={handleVewTask} />

<style>
  .title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title p {
    margin: 0;
    font-weight: 500;
    color: #ffffff;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: transparent;
    width: 100%;
    border: none;
    gap: 0.5rem;
    color: #c2c7d0;
    padding: 0 1.1rem;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: max-content;
    max-width: 50px;
    padding: 0.34em;
    font-size: 0.675em;
    border-radius: 0.2em 0.2em 0 0;
    font-weight: 500;
    background-color: #525f7a;
  }

  .done {
    background-color: #aefaae;
    color: green;
  }

  .dropdown {
    margin: 0;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  details.dropdown summary:not([role]) {
    padding: 0.2em;
    height: max-content;
  }

  details.dropdown summary::after {
    display: none;
  }

  details.dropdown summary + ul {
    left: -90px;
  }

  details.dropdown summary + ul li {
    padding-inline: 0;
  }

  details.dropdown summary + ul li:hover {
    background: #202632;
  }

  .content {
    width: 100%;
    text-align: justify;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    color: #c2c7d0;
  }
  .content:focus {
    outline: none;
    box-shadow: none;
  }

  .line-clamp-1 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  .line-clamp-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  .toggle {
    margin: 0;
  }

  .actions {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    position: relative;
  }
</style>
