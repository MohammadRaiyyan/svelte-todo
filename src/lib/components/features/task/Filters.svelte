<script>
  import { Button } from "$lib/components/ui/button/index";
  import { Label } from "$lib/components/ui/label/index";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";
  import { taskPriorityOptions, taskSortOptions, taskStatusOptions } from "$lib/constants/index";
  import { getTodosContext } from "$lib/store/Todos.svelte";
  import { ChevronsUpDownIcon, Flag, ListFilterPlus } from "@lucide/svelte";

  const todos = getTodosContext();
  const taskCount = $derived(todos.size());
</script>

<Popover.Root>
  <Popover.Trigger disabled={taskCount < 1}>
    <Button variant="outline" size="sm">
      <ListFilterPlus size="16" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="flex w-[300px]  flex-col gap-3" align="end">
    <h2 class=" font-medium">Filters</h2>
    <div class="space-y-2">
      <Label for="status">Status</Label>
      <Select.Root type="single" name="status" bind:value={todos.filter.status}>
        <Select.Trigger id="status" class="w-full">
          <div class="flex items-center gap-2">
            <ListFilterPlus size="16" />
            {taskStatusOptions.find((f) => f.value === todos.filter.status)?.label || "All Status"}
          </div>
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            {#each taskStatusOptions as option (option.value)}
              <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <div class="space-y-2">
      <Label for="priority">Priority</Label>
      <Select.Root type="single" name="priority" bind:value={todos.filter.priority}>
        <Select.Trigger id="priority" class="w-full">
          <div class="flex items-center gap-2">
            <Flag size="16" />
            {taskPriorityOptions.find((f) => f.value === todos.filter.priority)?.label ||
              "All Priority"}
          </div>
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value={"all"} label={"All"}>All</Select.Item>

            {#each taskPriorityOptions as option (option.value)}
              <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <div class="space-y-2">
      <Label for="sortBy">Sort By</Label>
      <Select.Root type="single" name="sortBy" bind:value={todos.sort}>
        <Select.Trigger id="sortBy" class="w-full">
          <div class="flex items-center gap-2 pr-2">
            <ChevronsUpDownIcon size={16} />
            {taskSortOptions.find((f) => f.value === todos.sort)?.label || "Sort by"}
          </div>
        </Select.Trigger>
        <Select.Content class="w-max">
          <Select.Group>
            {#each taskSortOptions as option (option.value)}
              <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  </Popover.Content>
</Popover.Root>
