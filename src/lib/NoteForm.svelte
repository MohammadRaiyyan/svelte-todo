<script lang="ts">
  import type { Note } from "../types/task";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "./components/ui/button/button.svelte";
  import Label from "./components/ui/label/label.svelte";
  import Textarea from "./components/ui/textarea/textarea.svelte";
  import Input from "./components/ui/input/input.svelte";
  import { X, Plus } from "@lucide/svelte";
  import * as Select from "$lib/components/ui/select/index";
  import { getNotesContext, setNotesContext } from "$lib/store/Notes.svelte";
  setNotesContext();
  const notes = getNotesContext();
  $inspect("from notes form", notes.showNoteModal);

  let getDefaultState = (): Note => ({
    title: "",
    content: "",
    id: crypto.randomUUID(),
    color: "#432345",
    createdAt: new Date(),
  });

  let noteState = $state<Note>(getDefaultState());
  let hasError = $state<{ title: boolean } | null>(null);

  const isOpen = $derived(notes.showNoteModal.show);
  const note = $derived(notes.showNoteModal.note);
  const action = $derived(notes.showNoteModal.type);
  const handleAction = $derived(notes.handleAction);

  let dialogTitle: string = $derived(action === "edit" ? "Update note" : "Add note");

  $effect(() => {
    if (action === "edit" && note) {
      noteState = {
        ...note,
      };
      dialogTitle = "Update note";
    }
  });

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const titleError = noteState.title.length === 0;

    if (titleError) {
      hasError = {
        title: titleError,
      };
      return;
    }
    if (action === "edit") {
      handleAction("update", noteState as Note);
      noteState = getDefaultState();
      return;
    }

    handleAction("create", {
      ...noteState,
    });
    noteState = getDefaultState();
  }
  function handleClose() {
    noteState = getDefaultState();
    handleAction("close");
  }
</script>

<Dialog.Root open={isOpen} onOpenChange={handleClose}>
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
          bind:value={noteState.title}
          id="title"
          placeholder="e.g. Today's though"
          type="text"
        />
        {#if hasError?.title}
          <small id="invalid-title"> Title should be greater than 10 characters </small>
        {/if}
      </div>

      <div class="space-y-2">
        <Label for="description">Description</Label>
        <Textarea
          aria-describedby="note-content"
          bind:value={noteState.content}
          id="description"
          placeholder="Write note description"
          rows={4}
        />
      </div>
      <div class="submit flex w-full items-center justify-end gap-3">
        <Button type="submit" size="sm" class="w-32">Create Note</Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
