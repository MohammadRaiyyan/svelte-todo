<script lang="ts">
    const {message = "No Task available!"}: { message?: string } = $props();
</script>

<div class="zero-state">
    <p>{message}</p>
</div>

<style>
    .zero-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
    }
</style>