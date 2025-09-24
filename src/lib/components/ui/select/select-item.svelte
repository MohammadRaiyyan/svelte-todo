<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    value,
    label,
    children: childrenProp,
    showCheckedIndicator = true,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> & {
    showCheckedIndicator?: boolean;
  } = $props();
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  class={cn(
    "relative flex w-full cursor-default select-none items-center px-3 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[selected]:bg-primary data-[highlighted]:text-accent-foreground data-[selected]:text-primary-foreground data-[disabled]:opacity-50",
    className
  )}
  {...restProps}
>
  {#snippet children({ selected, highlighted })}
    {#if childrenProp}
      {@render childrenProp({ selected, highlighted })}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
