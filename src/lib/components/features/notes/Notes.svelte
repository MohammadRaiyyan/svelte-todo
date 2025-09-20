<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card/index";
  import NoteForm from "$lib/components/features/notes/NoteForm.svelte";
  import ZeroState from "$lib/components/common/ZeroState.svelte";
  import { getNotesContext } from "$lib/store/Notes.svelte";
  import { getDynamicNoteBgColor } from "$lib/utils/getDynamicNoteBgColor";

  const notes = getNotesContext();
  const notesCount = $derived(notes.size());
</script>

<section class="space-y-4">
  <h2 class="font-semibold">Notes ({notesCount})</h2>

  {#if notesCount > 0}
    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {#each notes.getNotes() as note, i}
        {@const color = getDynamicNoteBgColor(i)}
        <Card class="overflow-hidden  border">
          <CardContent class="relative p-4">
            <div
              class="absolute left-0 right-0 top-0 h-1 w-full"
              style={`box-shadow: 0px 2px 4px ${color.bg}; background:${color.bg}`}
            ></div>

            <div class="space-y-3">
              <h3 title={note.title} class="line-clamp-2 text-xl font-semibold">{note.title}</h3>
              <div class="line-clamp-6">
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
