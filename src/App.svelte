<script lang="ts">
  import Navbar from "$lib/components/common/Navbar.svelte";
  import NoteForm from "$lib/components/features/notes/NoteForm.svelte";
  import Notes from "$lib/components/features/notes/Notes.svelte";
  import TaskForm from "$lib/components/features/task/TaskForm.svelte";
  import Tasks from "$lib/components/features/task/Tasks.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { setNotesContext } from "$lib/store/Notes.svelte";
  import { setTodosContext } from "$lib/store/Todos.svelte";
  import "./app.css";

  setTodosContext();
  setNotesContext();
</script>

<div class="space-y-8">
  <!--  Navbar Start-->
  <Toaster />
  <Navbar />
  <!--  Navbar End-->
  <main class="container mx-auto max-w-full px-3 md:max-w-[60%] md:px-6">
    <!--  Entity Toggle Start-->
    <Tabs value="tasks" class="space-y-8 ">
      <div class="flex items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <!-- <ToggleGroup type="single" value="list" variant="default">
          <ToggleGroupItem size="sm" value="grid"><Grid2x2 /></ToggleGroupItem>
          <ToggleGroupItem size="sm" value="list"><List /></ToggleGroupItem>
        </ToggleGroup> -->
      </div>
      <TabsContent value="tasks">
        <Tasks />
      </TabsContent>
      <TabsContent value="notes">
        <Notes />
      </TabsContent>
    </Tabs>
    <!--  Entity Toggle End-->
  </main>
  <NoteForm />
  <TaskForm />
</div>
