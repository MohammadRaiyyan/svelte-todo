<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from "bits-ui";
  import type { Snippet } from "svelte";
  import * as Dialog from "./index.js";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: DialogPrimitive.PortalProps;
    children: Snippet;
  } = $props();
</script>

<Dialog.Portal {...portalProps}>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    class={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded",
      className
    )}
    {...restProps}
  >
    {@render children?.()}
    <!-- <DialogPrimitive.Close
			class="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-none disabled:pointer-events-none"
		>
			<X class="size-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close> -->
  </DialogPrimitive.Content>
</Dialog.Portal>
