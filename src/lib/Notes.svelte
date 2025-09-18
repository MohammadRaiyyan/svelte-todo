<script>
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import NoteForm from "$lib/NoteForm.svelte";
  import ZeroState from "$lib/ZeroState.svelte";
  import { getNotesContext, setNotesContext } from "$lib/store/Notes.svelte";
  import { Button } from "$lib/components/ui/button";

  setNotesContext();
  const notes = getNotesContext();

  $inspect(notes.showNoteModal);

  const notesCount = $derived(notes.size());
</script>

<section>
  <h2>Notes</h2>
  <Button variant="secondary" onclick={() => notes.setShowNoteModal(true, "create", null)}
    >Create Note</Button
  >

  {#if notesCount > 0}
    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {#each notes.getNotes() as note}
        <Card class="bg-yellow-200 text-black">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="line-clamp-3">
              {note.content}
            </p>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else}
    <div>
      <ZeroState message={`No notes available`} />
    </div>
  {/if}
  <NoteForm />
</section>
