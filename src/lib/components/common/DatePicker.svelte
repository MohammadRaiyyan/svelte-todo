<script lang="ts">
  import { CalendarIcon } from "@lucide/svelte";
  import {
    DateFormatter,
    getLocalTimeZone,
    fromDate,
    type DateValue,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";

  import * as Popover from "$lib/components/ui/popover/index";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let {
    initialDate,
    placeholder,
    class: className = "",
    variant = "outline",
    onSelect,
  }: {
    initialDate: Date | undefined;
    placeholder: string;
    class?: string;
    variant?: "default" | "outline";
    onSelect: (date: Date | undefined) => void;
  } = $props();

  let value = $state<DateValue | undefined>();
  let contentRef = $state<HTMLElement | null>(null);
  let isMounted = $state<boolean>(false);

  // $effect(() => {
  //   if (initialDate && !isMounted) {
  //     value = fromDate(initialDate, getLocalTimeZone());
  //     isMounted = true;
  //   }
  // });
  //
  // $effect(() => {
  //   onSelect(value?.toDate(getLocalTimeZone()));
  // });
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: variant,
        class: "w-full justify-start  text-left font-normal hover:bg-transparent",
      }),
      !value && "text-muted-foreground",
      className
    )}
  >
    <CalendarIcon />
    {value ? df.format(value.toDate(getLocalTimeZone())) : placeholder}
  </Popover.Trigger>
  <Popover.Content bind:ref={contentRef} class="w-full p-0">
    <Calendar type="single" bind:value />
  </Popover.Content>
</Popover.Root>
