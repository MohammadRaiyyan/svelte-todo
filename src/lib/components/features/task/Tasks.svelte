<script lang="ts">
  import ZeroState from "$lib/components/common/ZeroState.svelte";
  import { getTodosContext } from "$lib/store/Todos.svelte";
  import Filters from "./Filters.svelte";
  import Task from "./Task.svelte";
  const todos = getTodosContext();

  $inspect(todos);
  const taskCount = $derived(todos.size());
  const tasks = $derived.by(() => todos.getTasks());
</script>

<section class="space-y-4">
  <div class="flex items-center justify-between gap-4">
    <h2 class="text-lg font-medium">Tasks ({taskCount})</h2>
    {#if taskCount > 0}
      <Filters />
    {/if}
  </div>
  {#if taskCount > 0}
    <div class="space-y-4">
      {#each tasks as task, i (task.id)}
        <Task bind:task={tasks[i]} />
      {/each}
    </div>
  {:else}
    <div>
      <ZeroState message={`No task available`} />
    </div>
  {/if}
</section>
