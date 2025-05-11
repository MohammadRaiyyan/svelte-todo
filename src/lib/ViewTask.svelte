<script lang="ts">
  import type { Task } from "../types/task";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { X } from "@lucide/svelte";

  const {
    task,
    handleClose,
    isOpen,
  }: { isOpen: boolean; task: Task | null; handleClose: () => void } = $props();
</script>

{#if task}
  <Dialog.Root open={isOpen} onOpenChange={() => handleClose()}>
    <Dialog.Content class="max-w-[95%] overflow-hidden rounded-lg p-0 md:max-w-[600px]">
      <Dialog.Header class="flex flex-row items-center justify-between bg-muted px-3 py-4 md:px-6">
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
