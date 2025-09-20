<script lang="ts">
  const { message = "No Task available!" }: { message?: string } = $props();
</script>

<article class="zero-state">
  <svg
    fill="none"
    height="48"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none" />
    <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
    <path d="M11 7h4" />
    <path d="M9 11h2" />
    <path d="M9 15h4" />
    <path d="M3 3l18 18" />
  </svg>
  <p>{message}</p>
</article>

<style>
  .zero-state {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    height: 200px;
  }
</style>
