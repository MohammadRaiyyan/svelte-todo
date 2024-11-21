<script lang="ts">
    import type {Filter, Task} from "../types/task";
    import ZeroState from "./ZeroState.svelte";
    import {fade} from "svelte/transition"

    const {tasks, handleDone, handleRemove, filter}: {
        tasks: Task[],
        handleDone: (task: Task) => void,
        handleRemove: (id: string) => void,
        filter: Filter
    } = $props();
</script>
{#if tasks.length > 0}
    {#each tasks as task}
        <article class="task" class:done={task.done} transition:fade>
            <input type="checkbox" class="toggle" onchange={()=>handleDone(task)} checked={task.done}/>
            <div class="content">
                <p>
                    {task.content}
                </p>
            </div>
            <button aria-label="Delete task" class="outline remove" onclick={()=> handleRemove(task.id)}>
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon-trash"
                >
                    <path d="M3 6h18"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/>
                </svg>
            </button>
        </article>
    {/each}
{:else}
    <div>
        <ZeroState message={`No ${filter} task found`}/>
    </div>
{/if}

<style>
    .remove {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .task {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
    }

    .content {
        width: 100%;
        text-align: justify;
    }

    .toggle {
        margin: 0;
        width: 35px;
        height: 25px;
    }

    .done {
        text-decoration: line-through;
    }
</style>