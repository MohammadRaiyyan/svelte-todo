<script lang="ts">
  import type { Task } from "../types/task";

  const {
    task,
    handleClose,
    isOpen,
  }: { isOpen: boolean; task: Task | null; handleClose: () => void } = $props();
</script>

{#if task}
  <dialog open={isOpen}>
    <article>
      <header>
        <button aria-label="Close" onclick={handleClose} rel="prev"></button>
        <p>
          <strong>{task?.title}</strong>
        </p>
      </header>
      <div>
        <p>{task?.content}</p>
      </div>
    </article>
  </dialog>
{/if}
