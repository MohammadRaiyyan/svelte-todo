<script lang="ts">
  import type { Action, Task } from "../types/task";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "./components/ui/button/button.svelte";
  import Label from "./components/ui/label/label.svelte";
  import Textarea from "./components/ui/textarea/textarea.svelte";
  import Input from "./components/ui/input/input.svelte";
  import { X, Plus } from "@lucide/svelte";
  import * as Select from "$lib/components/ui/select/index";
  import { taskPriorityOptions, taskStatusOptions } from "./constants";
  import DatePicker from "$lib/components/common/DatePicker.svelte";

  let getDefaultState = (): Task => ({
    title: "",
    content: "",
    id: crypto.randomUUID(),
    status: "todo",
    priority: "Low",
    createdAt: new Date(),
  });
  $inspect("task form");

  let taskState = $state<Task>(getDefaultState());
  let hasError = $state<{ title: boolean; content: boolean } | null>(null);

  const {
    isOpen = false,
    task = null,
    action = "create",
    handleAction,
  }: {
    isOpen: boolean;
    task?: Task | null;
    action: Action;
    handleAction: (action: Action, task?: Task) => void;
  } = $props();

  let dialogTitle = $derived(action === "edit" ? "Update task" : "Add task");

  $effect(() => {
    if (action === "edit" && task) {
      taskState = {
        ...task,
      };
      dialogTitle = "Update Task";
    }
  });

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const titleError = taskState.title.length === 0;
    const contentError = taskState.content.length === 0;

    if (titleError || contentError) {
      hasError = {
        title: titleError,
        content: contentError,
      };
      return;
    }
    if (action === "edit") {
      handleAction("update", taskState as Task);
      taskState = getDefaultState();
      return;
    }

    handleAction("create", {
      ...taskState,
    });
    taskState = getDefaultState();
  }
  function handleClose() {
    taskState = getDefaultState();
    handleAction("close");
  }
</script>

<Dialog.Root open={isOpen} onOpenChange={() => handleClose()}>
  <Dialog.Content class="max-w-[95%] overflow-hidden rounded-xl p-0 md:max-w-[600px]">
    <Dialog.Header
      class="flex flex-row items-center justify-between border-b bg-muted px-3 py-4 md:px-6"
    >
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Close aria-label="Close" onclick={() => handleClose()}>
        <X size="16" />
      </Dialog.Close>
    </Dialog.Header>

    <form onsubmit={onSubmit} class="grid gap-4 px-3 py-4 md:px-6">
      <div class="space-y-2">
        <Label for="title">Title</Label>
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
      <div class="flex w-full gap-4">
        <div class="w-full space-y-2">
          <Label for="status">Status</Label>
          <Select.Root type="single" bind:value={taskState.status} name="status">
            <Select.Trigger id="status" class=" w-full">
              {taskStatusOptions
                .filter((f) => f.value !== "all")
                .find((f) => f.value === taskState.status)?.label}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Status</Select.GroupHeading>
                {#each taskStatusOptions.filter((f) => f.value !== "all") as option (option.value)}
                  <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item
                  >
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div class="w-full space-y-2">
          <Label for="priority">Priority</Label>
          <Select.Root type="single" bind:value={taskState.priority} name="priority">
            <Select.Trigger id="priority" class=" w-full">
              {taskPriorityOptions.find((f) => f.value === taskState.priority)?.label}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Priority</Select.GroupHeading>
                {#each taskPriorityOptions as option (option.value)}
                  <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item
                  >
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <div class="flex w-full flex-col space-y-2">
        <Label for="priority">Due At</Label>
        <DatePicker
          placeholder="Pick due date"
          initialDate={taskState.dueAt}
          onSelect={(newDate) => (taskState.dueAt = newDate)}
        />
      </div>
      <div class="space-y-2">
        <Label for="description">Description</Label>
        <Textarea
          aria-describedby="invalid-content"
          aria-invalid={hasError?.content || undefined}
          bind:value={taskState.content}
          id="description"
          placeholder="e.g. Buy fresh vegetables and fruits"
          rows={4}
        />
        {#if hasError?.content}
          <small id="invalid-content"> Description should be greater than 15 characters </small>
        {/if}
      </div>
      <div class="submit flex w-full items-center justify-end gap-3">
        <Button type="submit" size="sm" class="w-32">Create Task</Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
