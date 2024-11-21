<script lang="ts">
    import type {Task} from "../types/task";

    let task = $state("");
    let hasError = $state(false)

    const {addTask}: { addTask: (task: Task) => void } = $props();

    function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (task.length < 15) {
            hasError = true;
            return
        }
        addTask({
            id: crypto.randomUUID(),
            content: task,
            done: false
        });
        task = ""
    }
</script>

<article>
    <form onsubmit={onSubmit}>
        <textarea aria-describedby="invalid-helper" aria-invalid={hasError || undefined} bind:value={task}
                  placeholder='e.g. Clean Clothes'
                  rows="4"></textarea>
        {#if hasError}
            <small id="invalid-helper">
                Task should be greater than 15 characters
            </small>
        {/if}
        <div class="submit">
            <button disabled={task.length < 15} type="submit">Add Task</button>
        </div>
    </form>
</article>

<style>
    .submit {
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
    }
    button[type="submit"] {
        width: max-content;
        margin-bottom: 0;
    }
</style>