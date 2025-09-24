<script lang="ts">
  import ZeroState from "$lib/components/common/ZeroState.svelte";
  import NoteForm from "$lib/components/features/notes/NoteForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Card, CardContent } from "$lib/components/ui/card/index";
  import { DropdownMenu, DropdownMenuTrigger } from "$lib/components/ui/dropdown-menu";
  import DropdownMenuContent from "$lib/components/ui/dropdown-menu/dropdown-menu-content.svelte";
  import DropdownMenuItem from "$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte";
  import { getNotesContext } from "$lib/store/Notes.svelte";
  import { getDynamicNoteBgColor } from "$lib/utils/getDynamicNoteBgColor";
  import { Ellipsis, PenBoxIcon, Trash } from "@lucide/svelte";

  const notes = getNotesContext();
  const notesCount = $derived(notes.size());
</script>

<section class="space-y-4">
  <h2 class="text-lg font-medium">Notes ({notesCount})</h2>

  {#if notesCount > 0}
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {#each notes.getNotes() as note, i}
        {@const color = getDynamicNoteBgColor(i)}
        <Card class="overflow-hidden  border">
          <CardContent class="relative p-4">
            <div
              class="absolute left-0 right-0 top-0 h-1 w-full"
              style={`box-shadow: 0px 2px 4px ${color.bg}; background:${color.bg}`}
            ></div>
            <div class="mb-3 flex items-start justify-between gap-2">
              <h3 title={note.title} class="line-clamp-2 text-xl font-semibold leading-none">
                {note.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="sm" class="h-5 w-7"><Ellipsis /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onclick={() => notes.setShowNoteModal(true, "edit", note)}>
                    <PenBoxIcon />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onclick={() => notes.handleAction("remove", note)}
                    class="text-destructive hover:bg-destructive/10"
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div class="space-y-3">
              <div>
                {@html note.content}
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else}
    <ZeroState message="No notes available" />
  {/if}

  <NoteForm />
</section>
