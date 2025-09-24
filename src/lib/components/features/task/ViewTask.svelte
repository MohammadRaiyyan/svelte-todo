<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { X } from "@lucide/svelte";
  import type { Task } from "../../../../types/task";

  const {
    task,
    handleClose,
    isOpen,
  }: { isOpen: boolean; task: Task | null; handleClose: () => void } = $props();
</script>

{#if task}
  <Dialog.Root open={isOpen} onOpenChange={() => handleClose()}>
    <Dialog.Content class="max-w-[95%] overflow-hidden rounded  p-0 md:max-w-[600px] ">
      <Dialog.Header
        class="flex flex-row items-center justify-between border-b bg-muted px-3 py-4 md:px-6"
      >
        <Dialog.Title>{task?.title}</Dialog.Title>
        <Dialog.Close aria-label="Close" onclick={() => handleClose()}>
          <X />
        </Dialog.Close>
      </Dialog.Header>

      <div class="grid gap-4 px-3 py-4 md:px-6">
        <p>{task?.content}</p>
      </div>
    </Dialog.Content>
  </Dialog.Root>
{/if}
