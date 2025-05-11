<script lang="ts">
  import type { Action, Filter, Status, Task } from "../types/task";
  import ZeroState from "./ZeroState.svelte";
  import { fade } from "svelte/transition";
  import * as Select from "$lib/components/ui/select/index";

  import * as Card from "$lib/components/ui/card/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Circle, EllipsisVertical } from "@lucide/svelte";
  import { Pencil } from "@lucide/svelte";
  import { Trash } from "@lucide/svelte";
  import { Eye } from "@lucide/svelte";
  import { taskStatusOptions } from "./constants";

  const {
    tasks,
    filter,
    handleAction,
  }: {
    tasks: Task[];
    filter: Filter;
    handleAction: (action: Action, task?: Task) => void;
  } = $props();
</script>

{#if tasks.length > 0}
  {#each tasks as task}
    <div transition:fade>
      <div
        class="w-max overflow-hidden rounded-t-lg"
        class:done={task.status === "done"}
        class:in-progress={task.status === "in-progress"}
        class:todo={task.status === "todo"}
      >
        <Select.Root
          type="single"
          value={task.status}
          name="status"
          onValueChange={(value) => handleAction("update", { ...task, status: value as Status })}
        >
          <Select.Trigger
            class="h-8 w-max gap-2 rounded-b-none border-b-0 bg-transparent focus:ring-0 focus:ring-offset-0"
          >
            {taskStatusOptions.find((f) => f.value === task.status)?.label}
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
      <Card.Root class="rounded-tl-none bg-muted">
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 px-3 py-3  md:px-6"
        >
          <div class="flex items-center gap-4">
            <!-- <input
                type="checkbox"
                class="toggle"
                onchange={() => handleAction("done", task)}
                checked={task.status === "done"}
              /> -->

            <Card.Title class="text-base md:text-2xl">{task.title}</Card.Title>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="mt-0  flex items-center"
              ><EllipsisVertical /></DropdownMenu.Trigger
            >
            <DropdownMenu.Content>
              <DropdownMenu.Item onclick={() => handleAction("view", task)}>
                <Eye />
                View</DropdownMenu.Item
              >
              <DropdownMenu.Item onclick={() => handleAction("edit", task)}>
                <Pencil />
                Edit</DropdownMenu.Item
              >
              <DropdownMenu.Separator />
              <DropdownMenu.Item class="text-red-500" onclick={() => handleAction("remove", task)}>
                <Trash />
                Delete</DropdownMenu.Item
              >
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Card.Header>
      </Card.Root>
    </div>
  {/each}
{:else}
  <div>
    <ZeroState message={`No ${filter} task found`} />
  </div>
{/if}

<style>
  .done {
    @apply bg-green-500 text-white;
  }
  .in-progress {
    @apply bg-orange-500 text-white;
  }
  .todo {
    @apply bg-indigo-500 text-white;
  }
</style>
