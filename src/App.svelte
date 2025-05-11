<script lang="ts">
  import "./app.css";
  import type { Filter, Status, Task } from "./types/task";
  import TaskForm from "./lib/TaskForm.svelte";
  import Tasks from "./lib/Tasks.svelte";
  import ZeroState from "./lib/ZeroState.svelte";
  import { getTodosContext, setTodosContext } from "./lib/store/Todos.svelte";
  import ViewTask from "./lib/ViewTask.svelte";
  import * as Select from "$lib/components/ui/select/index";
  import { BeakerIcon, Funnel, LucidePencil, Pencil, PencilIcon } from "@lucide/svelte";
  import { taskStatusOptions } from "$lib/constants";
  import Button from "$lib/components/ui/button/button.svelte";
  setTodosContext();

  const todos = getTodosContext();

  $inspect(todos.getTasks());

  const doneTaskCount = $derived(
    todos.getTasks().reduce((acc, curr) => acc + Number(curr.status === "done"), 0)
  );
  const taskCount = $derived(todos.size());
</script>

<main class="space-y-8">
  <header class="sticky top-0 z-50 flex h-16 items-center bg-muted">
    <nav class="container mx-auto flex max-w-5xl items-center justify-between px-3 md:px-6">
      <h2 class="text-xl font-semibold">DayFlow</h2>
      <Button
        variant="default"
        aria-label="Add task"
        onclick={() => todos.setShowTaskModal(true, "create", null)}
      >
        <LucidePencil /> Create Task
      </Button>
    </nav>
  </header>
  <section class="container mx-auto max-w-5xl space-y-8 px-3 md:px-6">
    {#if taskCount > 0}
      <div class="flex items-center justify-between">
        <Select.Root type="single" name="filter" bind:value={todos.filter}>
          <Select.Trigger class="w-[180px] bg-muted">
            <div class="flex items-center gap-2">
              <Funnel size={16} />
              {taskStatusOptions.find((f) => f.value === todos.filter)?.label || "Filter"}
            </div>
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Status</Select.GroupHeading>
              {#each taskStatusOptions as option (option.value)}
                <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex flex-col space-y-4">
        <Tasks filter={todos.filter} tasks={todos.getTasks()} handleAction={todos.handleAction} />
      </div>
    {:else}
      <ZeroState />
    {/if}
  </section>
  <section class="container mx-auto max-w-5xl">
    <TaskForm
      action={todos.showTaskModal.type}
      handleAction={todos.handleAction}
      isOpen={todos.showTaskModal.show && todos.showTaskModal.type !== "view"}
      task={todos.showTaskModal.task}
    />
    <ViewTask
      isOpen={todos.showTaskModal.show && todos.showTaskModal.type === "view"}
      task={todos.showTaskModal.task}
      handleClose={() => todos.setShowTaskModal(false, "close", null)}
    />
  </section>
</main>
