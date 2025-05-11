<script lang="ts">
  import type { Action, Task } from "../types/task";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "./components/ui/button/button.svelte";
  import Label from "./components/ui/label/label.svelte";
  import Textarea from "./components/ui/textarea/textarea.svelte";
  import Input from "./components/ui/input/input.svelte";
  import { X } from "@lucide/svelte";
  import * as Select from "$lib/components/ui/select/index";
  import { taskStatusOptions } from "./constants";

  let taskState = $state<Task>({
    title: "",
    content: "",
    id: crypto.randomUUID(),
    status: "todo",
  });
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
      taskState = {
        title: "",
        content: "",
        id: crypto.randomUUID(),
        status: "todo",
      };
      return;
    }

    handleAction("create", {
      ...taskState,
    });
    taskState = {
      title: "",
      content: "",
      id: crypto.randomUUID(),
      status: "todo",
    };
  }
  function handleClose() {
    taskState = {
      title: "",
      content: "",
      id: crypto.randomUUID(),
      status: "todo",
    };

    handleAction("close");
  }
</script>

<Dialog.Root open={isOpen} onOpenChange={() => handleClose()}>
  <Dialog.Content class="max-w-[95%] overflow-hidden rounded-lg p-0 md:max-w-[600px]">
    <Dialog.Header class="flex flex-row items-center justify-between bg-muted px-3 py-4 md:px-6">
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Close aria-label="Close" onclick={() => handleClose()}>
        <X />
      </Dialog.Close>
    </Dialog.Header>

    <form onsubmit={onSubmit} class="grid gap-4 px-3 py-4 md:px-6">
      <Label for="title">Title</Label>
      <Input
        bind:value={taskState.title}
        id="title"
        placeholder="e.g., Grocery Shopping"
        type="text"
        class="md:text-2xl "
      />
      {#if hasError?.title}
        <small id="invalid-title"> Title should be greater than 10 characters </small>
      {/if}
      <Select.Root type="single" bind:value={taskState.status} name="status">
        <Select.Trigger class=" w-full">
          {taskStatusOptions
            .filter((f) => f.value !== "all")
            .find((f) => f.value === taskState.status)?.label}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.GroupHeading>Status</Select.GroupHeading>
            {#each taskStatusOptions.filter((f) => f.value !== "all") as option (option.value)}
              <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Label for="description">Description</Label>
      <Textarea
        aria-describedby="invalid-content"
        aria-invalid={hasError?.content || undefined}
        bind:value={taskState.content}
        id="description"
        class="md:text-2xl "
        placeholder="e.g., Buy fresh vegetables and fruits"
        rows={4}
      />
      {#if hasError?.content}
        <small id="invalid-content"> Description should be greater than 15 characters </small>
      {/if}

      <div class="submit">
        <Button type="submit">Save</Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
