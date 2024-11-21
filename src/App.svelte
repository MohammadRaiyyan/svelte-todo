<script lang="ts">
    import type {Filter, Task} from "./types/task";
    import TaskForm from "./lib/TaskForm.svelte";
    import Tasks from "./lib/Tasks.svelte";
    import ZeroState from "./lib/ZeroState.svelte";
    import {localStore} from "./lib/services/localStore.svelte";

    let tasks = localStore<Task[]>("tasks", []);

    let currentFilter = $state<Filter>("all")
    let doneTaskCount = $derived(tasks.value.reduce((acc, curr) => acc + Number(curr.done), 0));
    let filteredTasks = $derived.by(() => {
        switch (currentFilter) {
            case "all":
                return tasks.value;
            case "done":
                return tasks.value.filter(task => task.done);
            case "todo":
                return tasks.value.filter(task => !task.done);
            default:
                return tasks.value
        }
    });


    function handleDone(task: Task) {
        task.done = !task.done;
    }

    function handleRemove(id: string) {
        const index = tasks.value.findIndex(task => task.id === id);
        tasks.value.splice(index, 1);
    }

    function addTask(task: Task) {
        tasks.value.push(task);

    }
</script>

<main class="container ">
    <TaskForm {addTask}/>
    <section class="task-container">
        {#if tasks.value.length > 0}
            <div class="header">
                <div>
                    <p>
                        <span>{doneTaskCount}</span> / <span>{tasks.value.length}</span> tasks completed
                    </p>
                </div>
                <div role="group">
                    <button class="filter" onclick={()=> currentFilter = "all"}>All</button>
                    <button class="filter secondary" onclick={()=> currentFilter = "todo"}>Todo</button>
                    <button class="filter secondary" onclick={()=> currentFilter = "done"}>Done</button>
                </div>
            </div>
            <div class="tasks">
                <Tasks filter={currentFilter} tasks={filteredTasks} {handleDone} {handleRemove}/>
            </div>
        {:else }
            <ZeroState/>
        {/if}
    </section>
</main>

<style>
    .container {
        max-width: 600px;
        height: calc(100vh - 40px);
        overflow: hidden;
    }

    .filter {
        width: max-content;
    }

    .task-container {
        height: calc(100vh - 196px);
        overflow-y: hidden;
    }

    .tasks {
        height: calc(100% - 96px);
        overflow-y: auto;
    }

</style>
