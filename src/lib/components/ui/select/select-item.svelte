<script lang="ts">
  import { cn } from "$lib/utils.js";
  import Check from "@lucide/svelte/icons/check";
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
    "relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
    className
  )}
  {...restProps}
>
  {#snippet children({ selected, highlighted })}
    {#if selected && showCheckedIndicator}
      <span class="absolute left-2 flex size-3.5 items-center justify-center">
        <Check class="size-4" />
      </span>
    {/if}
    {#if childrenProp}
      {@render childrenProp({ selected, highlighted })}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
