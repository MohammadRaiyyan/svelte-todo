<script lang="ts">
  import type { Action, Filter, Status, Task, Priority } from "../types/task";
  import ZeroState from "./ZeroState.svelte";
  import { fade } from "svelte/transition";
  import * as Select from "$lib/components/ui/select/index";

  import * as Card from "$lib/components/ui/card/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Flag } from "@lucide/svelte";
  import { PencilLine } from "@lucide/svelte";
  import { Trash } from "@lucide/svelte";
  import { taskStatusOptions } from "./constants";
  import { Button } from "$lib/components/ui/button";
  import { taskPriorityOptions } from "$lib/constants/index.js";
  import DatePicker from "$lib/components/common/DatePicker.svelte";
  import TaskForm from "$lib/TaskForm.svelte";
  import { getTodosContext, setTodosContext } from "$lib/store/Todos.svelte";

  setTodosContext();

  const todos = getTodosContext();

  $inspect(todos);
  const taskCount = $derived(todos.size());
</script>

<section>
  <h2>Tasks</h2>

  {#if taskCount > 0}
    <div class="space-y-4">
      {#each todos.getTasks() as task}
        <div transition:fade>
          <div
            class=" w-max overflow-hidden rounded-t-xl"
            class:done={task.status === "done"}
            class:in-progress={task.status === "in-progress"}
            class:todo={task.status === "todo"}
          >
            <Select.Root
              type="single"
              value={task.status}
              name="status"
              onValueChange={(value) =>
                todos.handleAction("update", { ...task, status: value as Status })}
            >
              <Select.Trigger
                class="flex h-7 w-max items-center gap-2 overflow-hidden rounded-b-none rounded-t-xl border-b-0 bg-transparent py-1 font-medium focus:ring-0 focus:ring-offset-0"
              >
                {taskStatusOptions.find((f) => f.value === task.status)?.label}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.GroupHeading>Status</Select.GroupHeading>
                  {#each taskStatusOptions.slice(1) as option (option.value)}
                    <Select.Item value={option.value} label={option.label}
                      >{option.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <Card.Root class="relative rounded-tl-none bg-muted">
            <Card.Header
              class="flex flex-row items-center justify-between space-y-0 px-2 py-1.5  md:px-4"
            >
              <div class="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
                <div class="flex flex-col md:w-2/3">
                  <!-- <input
                    type="checkbox"
                    class="toggle"
                    onchange={() => handleAction("done", task)}
                    checked={task.status === "done"}
                  /> -->

                  <Card.Title
                    onclick={() => todos.handleAction("view", task)}
                    class="cursor-pointer text-base">{task.title}</Card.Title
                  >
                  <!--              <Card.Description class="line-clamp-2 truncate text-base"-->
                  <!--                >{task.content}</Card.Description-->
                  <!--              >-->
                </div>
                <div class="flex items-center gap-3 md:w-1/3 md:justify-end">
                  <Select.Root
                    type="single"
                    value={task.priority}
                    name="priority"
                    onValueChange={(value) =>
                      todos.handleAction("update", { ...task, priority: value as Priority })}
                  >
                    <Select.Trigger
                      class="flex h-8 w-[125px] items-center gap-2 rounded-xl border-0 bg-secondary/70 hover:bg-accent dark:bg-secondary/20 dark:hover:bg-secondary"
                    >
                      <div
                        class:low={task.priority === "Low"}
                        class:normal={task.priority === "Normal"}
                        class:medium={task.priority === "Medium"}
                        class:heigh={task.priority === "High"}
                      >
                        <Flag class="h-4 w-4" />
                      </div>

                      {taskPriorityOptions.find((f) => f.value === task.priority)?.label ??
                        "Priority"}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        <Select.GroupHeading>Priority</Select.GroupHeading>
                        {#each taskPriorityOptions.slice(0) as option (option.value)}
                          <Select.Item value={option.value} label={option.label}
                            >{option.label}</Select.Item
                          >
                        {/each}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                  <DatePicker
                    variant="default"
                    class="h-8 w-[120px] bg-secondary/70 text-sm hover:bg-accent dark:bg-secondary/20 dark:hover:bg-secondary"
                    placeholder="No Due"
                    initialDate={task.dueAt}
                    onSelect={(value) => todos.handleAction("update", { ...task, dueAt: value })}
                  />
                  <div class="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onclick={() => todos.handleAction("edit", task)}
                    >
                      <PencilLine />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      class=" hover:bg-red-500/10 hover:text-red-500"
                      onclick={() => todos.handleAction("remove", task)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Header>
          </Card.Root>
        </div>
      {/each}
    </div>
  {:else}
    <div>
      <ZeroState message={`No task available`} />
    </div>
  {/if}
  <TaskForm
    action={todos.type}
    handleAction={todos.handleAction}
    isOpen={todos.show && todos.type !== "view"}
    task={todos.task}
  />
</section>

<style>
  .done {
    @apply bg-green-500/10 text-green-500;
  }
  .in-progress {
    @apply bg-orange-500/10 text-orange-500;
  }
  .todo {
    @apply bg-muted text-muted-foreground;
  }
  .low {
    @apply text-primary;
  }
  .normal {
    @apply text-accent-foreground;
  }
  .medium {
    @apply text-orange-500;
  }
  .heigh {
    @apply text-red-500;
  }
</style>
