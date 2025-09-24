<script lang="ts">
  import DatePicker from "$lib/components/common/DatePicker.svelte";
  import RichTextEditor from "$lib/components/common/RichTextEditor.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Select from "$lib/components/ui/select";
  import { taskPriorityOptions, taskStatusOptions } from "$lib/constants";
  import { getTodosContext } from "$lib/store/Todos.svelte";
  import { Circle, Flag, X } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import type { Task } from "../../../../types/task";
  import Button from "../../ui/button/button.svelte";
  import Input from "../../ui/input/input.svelte";
  import Label from "../../ui/label/label.svelte";

  const { noteModalState, handleAction } = getTodosContext();

  let getDefaultState = (): Task => ({
    title: "",
    content: "",
    id: crypto.randomUUID(),
    status: "todo",
    priority: "Low",
    createdAt: new Date(),
    dueAt: undefined,
  });

  let taskState = $state<Task>(getDefaultState());
  let hasError = $state<{ title: boolean; content: boolean } | null>(null);
  let dialogTitle = $state("Create task");

  $effect(() => {
    if (noteModalState.type !== "create" && noteModalState.task) {
      taskState = noteModalState.task;
      dialogTitle = "Task Detail";
    } else {
      taskState = getDefaultState();
      dialogTitle = "Create task";
    }
  });

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!taskState) return;
    const titleError = taskState.title.length === 0;
    const contentError = taskState.content.length === 0;

    if (titleError || contentError) {
      hasError = {
        title: titleError,
        content: contentError,
      };
      return;
    }
    toast.success(`Task has been 
    ${noteModalState.type === "edit" ? "updated" : "created"} `);
    if (noteModalState.type === "edit") {
      handleAction("update", taskState as Task);
      taskState = getDefaultState();
      return;
    }

    handleAction("create", taskState);
    taskState = getDefaultState();
  }
  function handleClose() {
    taskState = getDefaultState();
    handleAction("close", taskState as Task);
  }
  const isExpired = $derived.by(() => {
    if (!taskState || !taskState.dueAt) return false;

    const now = new Date();
    return now > new Date(taskState.dueAt);
  });

  function handleDescriptionChange(value: string) {
    taskState.content = value;
  }
</script>

<Dialog.Root open={noteModalState.show} onOpenChange={() => handleClose()}>
  <Dialog.Content class="max-w-[95%] overflow-hidden rounded p-0 md:max-w-[600px]">
    <Dialog.Header
      class="flex flex-row items-center justify-between border-b bg-muted px-3 py-4 md:px-6"
    >
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Close aria-label="Close" onclick={() => handleClose()}>
        <X size="16" />
      </Dialog.Close>
    </Dialog.Header>

    {#if taskState}
      <form onsubmit={onSubmit} class="grid gap-4 px-3 py-4 md:px-6">
        <!-- Title -->
        <div class="space-y-2">
          <Input
            bind:value={taskState.title}
            id="title"
            placeholder="e.g. Grocery Shopping"
            type="text"
          />
          {#if hasError?.title}
            <small id="invalid-title"> Title should be greater than 10 characters </small>
          {/if}
        </div>

        <!-- Status, Priority, Due At -->
        <div class="flex w-full gap-4">
          <!-- Status -->
          <div class="w-full space-y-2">
            <Label for="status">Status</Label>
            <Select.Root type="single" bind:value={taskState.status} name="status">
              <Select.Trigger id="status" class="w-full">
                <div class=" flex w-full items-center justify-start gap-2">
                  <div
                    class:done-text={taskState.status === "done"}
                    class:in-progress-text={taskState.status === "in-progress"}
                    class:todo-text={taskState.status === "todo"}
                  >
                    <Circle class="h-3 w-3" />
                  </div>
                  {taskStatusOptions
                    .filter((f) => f.value !== "all")
                    .find((f) => f.value === taskState?.status)?.label}
                </div>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each taskStatusOptions.filter((f) => f.value !== "all") as option (option.value)}
                    <Select.Item value={option.value} label={option.label}
                      >{option.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Priority -->
          <div class="w-full space-y-2">
            <Label for="priority">Priority</Label>
            <Select.Root type="single" bind:value={taskState.priority} name="priority">
              <Select.Trigger id="priority">
                <div class=" flex w-full items-center justify-start gap-2">
                  <div
                    class:heigh={taskState.priority === "High"}
                    class:low={taskState.priority === "Low"}
                    class:medium={taskState.priority === "Medium"}
                    class:normal={taskState.priority === "Normal"}
                  >
                    <Flag class="h-4 w-4" />
                  </div>
                  {taskPriorityOptions.find((f) => f.value === taskState?.priority)?.label}
                </div>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each taskPriorityOptions as option (option.value)}
                    <Select.Item value={option.value} label={option.label}
                      >{option.label}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Due Date -->
          <div class="w-full space-y-2">
            <Label for="date">Due At</Label>
            <DatePicker
              id="date"
              placeholder="Pick due date"
              bind:value={taskState.dueAt}
              minDate={new Date()}
              hasError={!isExpired ? "Task is overdue" : ""}
            />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <RichTextEditor
            placeholder="Write task description"
            editable
            value={taskState.content}
            onChange={handleDescriptionChange}
          />
          {#if hasError?.content}
            <small id="invalid-content"> Description should be greater than 15 characters </small>
          {/if}
        </div>

        <div class="submit flex w-full items-center justify-end gap-3">
          <Button type="submit" size="sm" class="w-32">Create Task</Button>
        </div>
      </form>
    {:else}
      <div class="p-6 text-center">No task data available</div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
