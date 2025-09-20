<script lang="ts">
  import DatePicker from "$lib/components/common/DatePicker.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select/index";
  import { taskPriorityOptions, taskStatusOptions } from "$lib/constants";
  import { getTodosContext } from "$lib/store/Todos.svelte";
  import { cn } from "$lib/utils";
  import { Circle, Flag, Trash } from "@lucide/svelte";
  import { fade } from "svelte/transition";

  import * as Card from "$lib/components/ui/card/index.js";
  import type { Task } from "../../../../types/task";

  let { task = $bindable() }: { task: Task } = $props();
  const todos = getTodosContext();
  const isExpired = $derived.by(() => {
    if (!task.dueAt) return false;

    const now = new Date();
    return now > new Date(task.dueAt);
  });
</script>

<div transition:fade>
  <div
    class=" w-max overflow-hidden rounded-t-xl"
    class:done={task.status === "done"}
    class:in-progress={task.status === "in-progress"}
    class:todo={task.status === "todo"}
  >
    <Select.Root bind:value={task.status} name="status" type="single">
      <Select.Trigger
        class="flex h-7 w-max items-center gap-2 overflow-hidden rounded-b-none rounded-t-xl border-b-0 bg-transparent py-1 font-medium focus:ring-0 focus:ring-offset-0"
      >
        <div
          class:done={task.status === "done"}
          class:in-progress={task.status === "in-progress"}
          class:todo={task.status === "todo"}
        >
          <Circle class="h-3 w-3" />
        </div>
        {taskStatusOptions.find((f) => f.value === task.status)?.label}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupHeading>Status</Select.GroupHeading>
          {#each taskStatusOptions.slice(1) as option (option.value)}
            <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  </div>
  <Card.Root class="relative rounded-tl-none">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 px-2 py-1.5  md:px-4">
      <div class="flex w-full flex-col justify-between gap-3 md:flex-row md:items-center">
        <div class="flex flex-col md:w-2/3">
          <!-- <input
            type="checkbox"
            class="toggle"
            onchange={() => handleAction("done", task)}
            checked={task.status === "done"}
          /> -->

          <Card.Title
            class="cursor-pointer text-base"
            onclick={() => todos.handleAction("view", task)}>{task.title}</Card.Title
          >
          <!--              <Card.Description class="line-clamp-2 truncate text-base"-->
          <!--                >{task.content}</Card.Description-->
          <!--              >-->
        </div>
        <div class="flex items-center gap-3 md:w-1/3 md:justify-end">
          <Select.Root bind:value={task.priority} name="priority" type="single">
            <Select.Trigger class="flex h-8 w-40 items-center gap-2 rounded-xl ">
              <div
                class:heigh={task.priority === "High"}
                class:low={task.priority === "Low"}
                class:medium={task.priority === "Medium"}
                class:normal={task.priority === "Normal"}
              >
                <Flag class="h-4 w-4" />
              </div>

              {taskPriorityOptions.find((f) => f.value === task.priority)?.label ?? "Priority"}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Priority</Select.GroupHeading>
                {#each taskPriorityOptions.slice(0) as option (option.value)}
                  <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item
                  >
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <DatePicker
            bind:value={task.dueAt}
            class={cn("h-8 w-max ")}
            minDate={new Date()}
            placeholder="No due date"
            hasError={!isExpired ? "Task is overdue" : ""}
          />
          <div class="flex items-center gap-3">
            <Button
              class=" hover:bg-red-500/10 hover:text-red-500"
              onclick={() => todos.handleAction("remove", task)}
              size="sm"
              variant="ghost"
            >
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </Card.Header>
  </Card.Root>
</div>
