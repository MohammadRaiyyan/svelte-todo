<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Bold,
    Code,
    CornerDownLeft,
    Eraser,
    Italic,
    List,
    ListOrdered,
    Minus,
    PenTool,
    Quote,
    Strikethrough,
  } from "@lucide/svelte";
  import { Editor, type EditorOptions } from "@tiptap/core";
  import { Color } from "@tiptap/extension-color";
  import ListItem from "@tiptap/extension-list-item";
  import { TextStyle } from "@tiptap/extension-text-style";
  import { StarterKit } from "@tiptap/starter-kit";

  import { onMount } from "svelte";
  type Level = 1 | 2 | 3 | 4 | 5 | 6;
  const headingLevel: Level[] = [1, 2, 3, 4, 5, 6];
  let isOpen = $state<boolean>(false);
  let element = $state<EditorOptions["element"]>();
  let editor = $state<Editor>();
  let chosenColor = $state<string>("");

  let {
    editable = true,
    value,
    onChange,
    placeholder = "Write something...",
  }: {
    value: string;
    placeholder: string;
    editable: boolean;
    onChange: (v: string) => void;
  } = $props();

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit,
      ],
      content: value,
      onTransaction: () => {
        editor = editor;
      },
    });
    editor.on("update", ({ editor: ed }) => {
      onChange(ed.getHTML());
    });
    return () => {
      editor?.destroy();
      editor = undefined;
    };
  });

  $effect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  });
</script>

<div class="relative">
  {#if editor}
    <div class="absolute -right-3.5 -top-3.5 z-50">
      <Button
        onclick={() => (isOpen = !isOpen)}
        class="h-7 w-7"
        variant="outline"
        size="sm"
        title="Show Toolbar"
        ><PenTool />
      </Button>
      <div class="editor-toolbar floating-toolbar" class:open={isOpen}>
        <!-- Bold -->
        <Button
          onclick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
          class={editor.isActive("bold") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="Bold"
        >
          <Bold class="h-4 w-4" />
        </Button>

        <!-- Italic -->
        <Button
          onclick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
          class={editor.isActive("italic") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="Italic"
        >
          <Italic class="h-4 w-4" />
        </Button>

        <!-- Headings -->
        {#each headingLevel as level}
          <Button
            disabled={!editor.can().toggleHeading({ level })}
            onclick={() => editor?.chain().focus().toggleHeading({ level }).run()}
            class={editor.isActive("heading", { level }) ? "is-active" : ""}
            variant="ghost"
            size="sm"
            title={`Heading ${level}`}
          >
            H{level}
          </Button>
        {/each}

        <!-- Strikethrough -->
        <Button
          onclick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
          class={editor.isActive("strike") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="Strike"
        >
          <Strikethrough class="h-4 w-4" />
        </Button>

        <!-- Inline Code -->
        <Button
          onclick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editor.can().toggleCode()}
          class={editor.isActive("code") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="Code"
        >
          <Code class="h-4 w-4" />
        </Button>

        <!-- Clear Marks -->
        <Button
          onclick={() => editor?.chain().focus().unsetAllMarks().run()}
          variant="ghost"
          size="sm"
          title="Unset"
        >
          <Eraser class="h-4 w-4" />
        </Button>

        <!-- Bullet List -->
        <Button
          onclick={() => editor?.chain().focus().toggleBulletList().run()}
          class={editor.isActive("bulletList") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="BulletList"
        >
          <List class="h-4 w-4" />
        </Button>

        <!-- Ordered List -->
        <Button
          onclick={() => editor?.chain().focus().toggleOrderedList().run()}
          class={editor.isActive("orderedList") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="OrderedList"
        >
          <ListOrdered class="h-4 w-4" />
        </Button>

        <!-- Blockquote -->
        <Button
          onclick={() => editor?.chain().focus().toggleBlockquote().run()}
          class={editor.isActive("blockquote") ? "is-active" : ""}
          variant="ghost"
          size="sm"
          title="Blockquote"
        >
          <Quote class="h-4 w-4" />
        </Button>

        <!-- Horizontal rule -->
        <Button
          onclick={() => editor?.chain().focus().setHorizontalRule().run()}
          variant="ghost"
          size="sm"
          title="Horizontal rule"
        >
          <Minus class="h-4 w-4" />
        </Button>
        <!--        &lt;!&ndash; Color Picker &ndash;&gt;-->
        <!--        <div-->
        <!--          class="inline-flex h-10 w-10 items-center justify-center rounded border border-transparent bg-transparent p-0 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"-->
        <!--        >-->
        <!--          <input-->
        <!--            type="color"-->
        <!--            class="h-8 w-8 rounded border-transparent"-->
        <!--            bind:value={chosenColor}-->
        <!--            oninput={() => editor?.chain().focus().setColor(chosenColor).run()}-->
        <!--            title="Color"-->
        <!--          />-->
        <!--        </div>-->
        <!-- Hard break -->
        <Button
          onclick={() => editor?.chain().focus().setHardBreak().run()}
          variant="ghost"
          size="sm"
          title="Hard break"
        >
          <CornerDownLeft class="h-4 w-4" />
        </Button>
      </div>
    </div>
  {/if}
  <div class="editor" bind:this={element}></div>
</div>

<style>
  .editor {
    @apply overflow-hidden rounded border border-input ring-primary focus-within:ring-2;
  }
  .floating-toolbar {
    @apply absolute -top-14 right-0 z-50 flex max-w-[500px] items-center gap-1 overflow-x-auto rounded border bg-popover px-2 py-1 shadow-xl;
    transform: translateX(120%);
    opacity: 0;
    transition:
      transform 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
  }

  .floating-toolbar.open {
    transform: translateX(0);
    opacity: 1;
  }
  .is-active {
    @apply text-primary;
  }

  :global(.tiptap) {
    @apply max-h-80 min-h-60 overflow-y-auto px-3 py-2 outline-none;

    & :first-child {
      margin-top: 0;
    }

    /* List styles */
    & ul,
    ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;

      & li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }
    & ul {
      list-style-type: disc !important;
    }
    & ol {
      list-style-type: decimal !important;
      padding-left: 16px;
    }

    /* Heading styles */
    & h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
      margin-top: 2.5rem;
      text-wrap: pretty;
    }

    & h1,
    h2 {
      margin-top: 3.5rem;
      margin-bottom: 1.5rem;
    }

    & h1 {
      font-size: 1.4rem;
    }

    & h2 {
      font-size: 1.2rem;
    }

    & h3 {
      font-size: 1.1rem;
    }

    & h4,
    h5,
    h6 {
      font-size: 1rem;
    }

    /* Code and preformatted text styles */
    & code {
      @apply rounded bg-accent text-accent-foreground;
      font-size: 0.85rem;
      padding: 0.25em 0.3em;
    }

    & pre {
      @apply rounded bg-accent text-accent-foreground;
      font-family: "JetBrainsMono", monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;

      & code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }
    }

    & blockquote {
      @apply border-l-4;
      margin: 1.5rem 0;
      padding-left: 1rem;
    }

    & hr {
      @apply border-t;
      margin: 2rem 0;
    }
  }
</style>
