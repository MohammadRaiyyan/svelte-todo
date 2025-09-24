<script lang="ts">
  import { getNotesContext } from "$lib/store/Notes.svelte";
  import { ChevronDown, PenBoxIcon } from "@lucide/svelte";
  import { getTodosContext } from "../../store/Todos.svelte";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";

  const todos = getTodosContext();
  const notes = getNotesContext();
</script>

<header class="sticky top-0 z-50 flex h-16 items-center border-b bg-muted">
  <nav
    class="container mx-auto flex max-w-full items-center justify-between px-3 md:max-w-[60%] md:px-6"
  >
    <h2 class="text-xl font-semibold">FlowBoard</h2>
    <DropdownMenu>
      <DropdownMenuTrigger
        class="h-10 w-[132px] rounded border-primary bg-primary text-primary-foreground"
      >
        <div class="flex items-center gap-2 text-sm">
          <div class="flex items-center gap-2 border-r border-primary-foreground/50 px-3 py-2">
            <PenBoxIcon size={16} />
            Create
          </div>
          <div class="w-max pr-3"><ChevronDown size={16} class="opacity-50" /></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-[132px]">
        <DropdownMenuItem onclick={() => todos.setShowTaskModal(true, "create", null)}
          >Task</DropdownMenuItem
        >
        <DropdownMenuItem onclick={() => notes.setShowNoteModal(true, "create", null)}
          >Note</DropdownMenuItem
        >
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</header>
