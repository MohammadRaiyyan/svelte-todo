<script lang="ts">
  import ZeroStateIcon from "./icon/ZeroState.svelte";
  const { message = "No Task available!" }: { message?: string } = $props();
</script>

<article class="zero-state">
  <ZeroStateIcon />
  <h3 class="text-xl font-medium">{message}</h3>
</article>

<style>
  .zero-state {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    height: 500px;
  }
</style>
