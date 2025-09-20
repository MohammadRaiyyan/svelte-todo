<script lang="ts">
  import { cn } from "$lib/utils";
  import { Calendar, ChevronLeft, ChevronRight, Info } from "@lucide/svelte";
  import { onMount } from "svelte";
  import Button from "../ui/button/button.svelte";
  import * as Select from "../ui/select";
  import * as Tooltip from "../ui/tooltip";
  /**
   * Props for the DatePicker component
   * @param {string | undefined} value - Bound date value.
   * @param {string} placeholder - Placeholder text for the input.
   * @param {Date | undefined} maxDate - Maximum selectable date.
   * @param {Date | undefined} minDate - Minimum selectable date.
   * @param {string | undefined} id - Id to use in form
   * @param {string | undefined} ariaLabel - To describe the field
   * @param {string | undefined} class - To control the look of trigger
   * @param {string} hasError - Error message to show (if any)
   */
  let {
    value = $bindable(),
    placeholder = "Pick a date",
    maxDate,
    minDate,
    id,
    ariaLabel,
    class: className = "",
    hasError = "",
  }: {
    value: string | undefined;
    placeholder?: string;
    maxDate?: Date;
    minDate?: Date;
    id?: string;
    ariaLabel?: string;
    class?: string;
    hasError?: string;
  } = $props();

  /** Controls visibility of the datepicker dropdown */
  let datepickerVisible = $state(false);

  /** The currently viewed month in the calendar */
  let currentDate = $state(new Date());

  /** Selected date string in Date.toDateString() format */
  let selectedDate = $state<string>();

  /** Weekday labels for the calendar header */
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  /** Month labels for dropdowns */
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );

  /** List of years available for selection (computed onMount) */
  let years = $state<number[]>([]);

  // ---------------- Helpers ----------------

  /**
   * Returns number of days in a given month/year.
   * @param {number} year
   * @param {number} month
   * @returns {number} Days in month
   * @note Why: Used to build the calendar grid dynamically.
   */
  function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Derived: Calendar days array for current month view
   * Each element is either null (empty cell) or "M/D/YYYY" string.
   * @note Why: Needed to render the 7xN grid including offsets for first weekday.
   */
  let calendarDays = $derived.by(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday as first day

    const days: (string | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= daysInMonth(year, month); i++) {
      days.push(`${month + 1}/${i}/${year}`);
    }
    return days;
  });

  /**
   * Derived: Allowed years considering minDate and maxDate
   * @note Why: Prevents users from jumping outside valid range.
   */
  let allowedYears = $derived.by(() => {
    const minYear = minDate ? minDate.getFullYear() : currentDate.getFullYear() - 100;
    const maxYear = maxDate ? maxDate.getFullYear() : currentDate.getFullYear() + 100;
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  });

  /**
   * Derived: Allowed months for current year considering minDate/maxDate
   * @note Why: Dynamically restricts month dropdown when user selects min/max year.
   */
  let allowedMonths = $derived.by(() => {
    const year = currentDate.getFullYear();
    let start = 0;
    let end = 11;

    if (minDate && year === minDate.getFullYear()) start = minDate.getMonth();
    if (maxDate && year === maxDate.getFullYear()) end = maxDate.getMonth();

    return months.map((m, i) => ({ label: m, value: i })).slice(start, end + 1);
  });

  /**
   * Sets the selected date and closes the picker
   * @param {string} day - Date string in "M/D/YYYY" format
   * @note How: Updates selectedDate and the bound `value` prop.
   */
  function selectDate(day: string) {
    const newDate = new Date(day);
    if (selectedDate && isSameDay(new Date(selectedDate), newDate)) return;

    selectedDate = newDate.toDateString();
    value = newDate.toDateString();
    datepickerVisible = false;
  }

  /**
   * Checks if two dates are the same day
   * @param {Date} d1
   * @param {Date} d2
   */
  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  /**
   * Checks if a calendar cell corresponds to the selected date
   * @param {string} day
   */
  function isCurrentDay(day: string) {
    const [month, date, year] = day.split("/").map(Number);
    const dayDate = new Date(year, month - 1, date);
    return selectedDate ? isSameDay(new Date(selectedDate), dayDate) : false;
  }

  // ---------------- Month navigation ----------------

  /** Start of month helper */
  function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  /** End of month helper */
  function endOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  /**
   * Can navigate to previous month
   */
  function canGoPrevMonth() {
    if (!minDate) return true;
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    return prev >= startOfMonth(minDate);
  }

  /**
   * Can navigate to next month
   */
  function canGoNextMonth() {
    if (!maxDate) return true;
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    return next <= endOfMonth(maxDate);
  }

  /** Navigate to previous month if allowed */
  function prevMonth() {
    if (canGoPrevMonth()) {
      currentDate.setMonth(currentDate.getMonth() - 1);
      currentDate = new Date(currentDate);
    }
  }

  /** Navigate to next month if allowed */
  function nextMonth() {
    if (canGoNextMonth()) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate = new Date(currentDate);
    }
  }

  /** Set month directly (from dropdown) */
  function setMonth(m: number) {
    currentDate.setMonth(m);
    currentDate = new Date(currentDate);
  }

  /** Set year directly (from dropdown) */
  function setYear(y: number) {
    currentDate.setFullYear(y);
    currentDate = new Date(currentDate);
  }

  /**
   * Check if a date should be disabled based on minDate/maxDate
   */
  function isDateDisabled(dateStr: string): boolean {
    const date = new Date(dateStr);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  // ---------------- Lifecycle ----------------
  onMount(() => {
    if (value) selectedDate = new Date(value)?.toDateString();

    const minYear = minDate ? minDate.getFullYear() : currentDate.getFullYear() - 100;
    const maxYear = maxDate ? maxDate.getFullYear() : currentDate.getFullYear() + 100;
    years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  });
</script>

<div class="relative mx-auto w-full">
  <Select.Root
    type="single"
    value={selectedDate}
    onValueChange={selectDate}
    open={datepickerVisible}
  >
    <Select.Trigger
      {id}
      aria-label={ariaLabel}
      onclick={() => (datepickerVisible = !datepickerVisible)}
      class={cn("flex w-max items-center gap-2 border border-input", className)}
    >
      <Calendar class="h-4 w-4" />
      {#if hasError}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger><Info class="h-4 w-4 text-red-500" /></Tooltip.Trigger>
            <Tooltip.Content>
              <p>{hasError}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      {/if}
      <span class="line-clamp-1">
        {selectedDate
          ? new Date(selectedDate).toLocaleDateString("en-US", { dateStyle: "medium" })
          : placeholder}
      </span>
    </Select.Trigger>

    <Select.Content align="center" class="flex flex-col items-center gap-4 p-0">
      <!-- Header -->
      <div class="flex h-12 w-full items-center justify-between gap-2 border-b pb-1">
        <Button variant="ghost" class="h-8 w-8" onclick={prevMonth} disabled={!canGoPrevMonth()}>
          <ChevronLeft />
        </Button>

        <div class="flex items-center gap-2">
          <!-- Month Select -->
          <Select.Root
            type="single"
            value={String(currentDate.getMonth())}
            onValueChange={(m) => setMonth(+m)}
          >
            <Select.Trigger class="h-8 w-32 p-2 text-sm capitalize"
              >{months[currentDate.getMonth()]}</Select.Trigger
            >
            <Select.Content>
              {#each allowedMonths as m}
                <Select.Item value={String(m.value)}>{m.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>

          <!-- Year Select -->
          <Select.Root
            type="single"
            value={String(currentDate.getFullYear())}
            onValueChange={(y) => setYear(+y)}
          >
            <Select.Trigger class="h-8 w-24 p-2 text-sm">{currentDate.getFullYear()}</Select.Trigger
            >
            <Select.Content>
              {#each allowedYears as year}
                <Select.Item value={String(year)}>{year}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <Button variant="ghost" class="h-8 w-8" onclick={nextMonth} disabled={!canGoNextMonth()}>
          <ChevronRight />
        </Button>
      </div>

      <!-- Weekdays -->
      <div class="grid grid-cols-7 items-center justify-between text-sm font-medium capitalize">
        {#each weekdays as day}
          <span class="col-span-1 flex h-10 items-center justify-center font-bold">{day}</span>
        {/each}
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 justify-between gap-1">
        {#each calendarDays as day}
          <div class="col-span-1 flex items-center justify-center">
            {#if day}
              <Select.Item
                showCheckedIndicator={false}
                class={`flex h-10 w-10 items-center justify-center pl-2 ${
                  isCurrentDay(day) ? "bg-primary text-primary-foreground hover:bg-primary/80" : ""
                }`}
                value={day}
                disabled={isDateDisabled(day)}
              >
                {day.split("/")[1]}
              </Select.Item>
            {:else}
              <div></div>
            {/if}
          </div>
        {/each}
      </div>
    </Select.Content>
  </Select.Root>
</div>
