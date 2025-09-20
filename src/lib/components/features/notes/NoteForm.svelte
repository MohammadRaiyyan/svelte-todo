<script lang="ts">
  import type { Note } from "../../../../types/task";
  import * as Dialog from "$lib/components/ui/dialog";
  import Button from "../../ui/button/button.svelte";
  import Label from "../../ui/label/label.svelte";
  import Textarea from "../../ui/textarea/textarea.svelte";
  import Input from "../../ui/input/input.svelte";
  import { X, Plus } from "@lucide/svelte";
  import * as Select from "$lib/components/ui/select";
  import { getNotesContext, setNotesContext } from "$lib/store/Notes.svelte";
  import RichTextEditor from "$lib/components/common/RichTextEditor.svelte";

  const { noteModalState, handleAction } = getNotesContext();
  let getDefaultState = (): Note => ({
    title: "",
    content: "",
    id: crypto.randomUUID(),
    color: "#432345",
    createdAt: new Date(),
  });

  let noteState = $state<Note>(getDefaultState());
  let hasError = $state<{ title: boolean } | null>(null);

  let dialogTitle: string = $derived(
    noteModalState.type === "edit" ? "Update note" : "Create note"
  );

  $effect(() => {
    if (noteModalState.type === "edit" && noteModalState.note) {
      noteState = {
        ...noteModalState.note,
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
    if (noteModalState.type === "edit") {
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

<Dialog.Root open={noteModalState.show} onOpenChange={handleClose}>
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
        <!--        <Textarea-->
        <!--          aria-describedby="note-content"-->
        <!--          bind:value={}-->
        <!--          id="description"-->
        <!--          placeholder="Write note description"-->
        <!--          rows={4}-->
        <!--        />-->
        <RichTextEditor
          placeholder="Write note description"
          editable
          bind:value={noteState.content}
        />
      </div>
      <div class="submit flex w-full items-center justify-end gap-3">
        <Button type="submit" size="sm" class="w-32">Create Note</Button>
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
