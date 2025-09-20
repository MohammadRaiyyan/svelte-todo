<script lang="ts">
  import { cn } from "$lib/utils.js";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger
  bind:ref
  class={cn(
    "focus:ring-offset-none flex h-10 w-full items-center justify-between rounded-xl border border-input  px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1",
    className
  )}
  {...restProps}
>
  {@render children?.()}
  <ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
