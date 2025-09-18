<script lang="ts">
  import Button from "../ui/button/button.svelte";
  import { PencilLine, ChevronDown } from "@lucide/svelte";
  import { getTodosContext, setTodosContext } from "../../store/Todos.svelte";
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
  } from "../ui/dropdown-menu";
  import { getNotesContext, setNotesContext } from "$lib/store/Notes.svelte";
  setTodosContext();
  // setNotesContext();

  const todos = getTodosContext();
  // const notes = getNotesContext();
</script>

<header class="sticky top-0 z-50 flex h-16 items-center border-b bg-muted">
  <nav
    class="container mx-auto flex max-w-full items-center justify-between px-3 md:max-w-[80%] md:px-6"
  >
    <h2 class="text-xl font-semibold">FlowBoard</h2>
    <DropdownMenu>
      <DropdownMenuTrigger class="h-10 w-[132px] rounded-xl border-primary bg-primary">
        <div class="flex items-center gap-2 text-sm">
          <div class="flex items-center gap-2 border-r border-primary-foreground/50 px-3 py-2">
            <PencilLine size={16} />
            Create
          </div>
          <div class="w-max pr-3"><ChevronDown size={16} class="opacity-50" /></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-[132px]">
        <DropdownMenuItem onclick={() => todos.setShowTaskModal(true, "create", null)}
          >Task</DropdownMenuItem
        >
        <!--        <DropdownMenuItem onclick={() => notes.setShowNoteModal(true, "create", null)}-->
        <!--          >Note</DropdownMenuItem-->
        <!--        >-->
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</header>
