<script lang="ts">
  import type { Task } from "../types/task";

  const defaultTask = {
    title: "",
    content: "",
  };
  const defaultError = {
    title: false,
    content: false,
  };
  let taskState = $state(defaultTask);
  let hasError = $state(defaultError);

  const {
    addTask = () => {},
    isOpen = false,
    handleClose,
    task = null,
    handleUpdate = () => {},
  }: {
    addTask?: (task: Task) => void;
    isOpen: boolean;
    handleClose: () => void;
    task?: Task | null;
    handleUpdate?: (task: Task, id: string) => void;
  } = $props();

  let buttonTitle = $derived(task ? "Update task" : "Add task");

  $effect(() => {
    if (task) {
      taskState = {
        title: task.title,
        content: task.content,
      };
    }
  });

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    hasError.title = taskState.title.length < 10;
    if (taskState.content.length < 15) {
      hasError.content = true;
      return;
    }

    hasError = defaultError;

    if (task) {
      handleUpdate({ ...task, ...taskState }, task.id);
      taskState = defaultTask;
      return;
    }

    addTask({
      id: crypto.randomUUID(),
      ...taskState,
      status: "Todo",
    });
    taskState = defaultTask;
  }
</script>

<dialog open={isOpen}>
  <article>
    <header>
      <button aria-label="Close" onclick={handleClose} rel="prev"></button>
      <p>
        <strong>Create Task</strong>
      </p>
    </header>
    <form onsubmit={onSubmit}>
      <fieldset>
        <label for="title">
          Title
          <input
            aria-describedby="invalid-title"
            aria-invalid={hasError.title || undefined}
            bind:value={taskState.title}
            id="title"
            placeholder="e.g., Grocery Shopping"
            type="text"
          />
          {#if hasError.title}
            <small id="invalid-title"> Title should be greater than 10 characters </small>
          {/if}
        </label>
        <label for="description">
          Description
          <textarea
            aria-describedby="invalid-content"
            aria-invalid={hasError.content || undefined}
            bind:value={taskState.content}
            id="description"
            placeholder="e.g., Buy fresh vegetables and fruits"
            rows="4"
          ></textarea>
          {#if hasError.content}
            <small id="invalid-content"> Description should be greater than 15 characters </small>
          {/if}
        </label>
      </fieldset>

      <div class="submit">
        <button type="submit">{buttonTitle}</button>
      </div>
    </form>
  </article>
</dialog>

<style>
  .submit {
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
  }

  button[type="submit"] {
    width: max-content;
    margin-bottom: 0;
  }
</style>
