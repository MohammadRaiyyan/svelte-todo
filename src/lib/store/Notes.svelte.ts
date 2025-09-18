import { localStore, type LocalStoreType } from "$lib/services/localStore.svelte";
import type { Action, Note } from "../../types/task";
import { getContext, setContext } from "svelte";

const NOTES_KEY = Symbol("_notes_key");

interface NotesType {
  notes: LocalStoreType<Note[]>;
  showNoteModal: { show: boolean; type: Action; note: Note | null };

  addNote(note: Note): void;
  removeNote(id: string): void;
  updateNote(id: string, note: Note): void;

  getNotes(): Note[];

  setShowNoteModal(value: boolean, type: Action, note: Note | null): void;

  handleAction(action: Action, note?: Note): void;

  size(): number;
}

class Notes implements NotesType {
  notes: LocalStoreType<Note[]> = localStore<Note[]>("notes", []);

  showNoteModal = $state<{ show: boolean; type: Action; note: Note | null }>({
    show: false,
    type: "create",
    note: null,
  });

  addNote = (note: Note) => {
    this.notes.value.push(note);
    this.setShowNoteModal(false, "create", null);
  };

  removeNote = (id: string) => {
    this.notes.value = this.notes.value.filter((note) => note.id !== id);
  };

  updateNote = (id: string, note: Note) => {
    this.notes.value = this.notes.value.map((t) => (t.id === id ? note : t));
    this.setShowNoteModal(false, "edit", null);
  };

  getNotes = () => {
    return this.notes.value;
  };

  setShowNoteModal = (value: boolean, type: Action, note: Note | null = null) => {
    // console.log(value, type, note);
    this.showNoteModal.show = value;
    this.showNoteModal.type = type;
    this.showNoteModal.note = note;
  };
  handleAction = (action: Action, note?: Note) => {
    if (action === "remove") this.removeNote(note!.id);
    else if (action === "edit") this.setShowNoteModal(true, "edit", note);
    else if (action === "view") this.setShowNoteModal(true, "view", note);
    else if (action === "create") this.addNote(note!);
    else if (action === "close") this.setShowNoteModal(false, "create", null);
    else if (action === "update") this.updateNote(note!.id, note!);
    else this.updateNote(note!.id, note!);
  };
  size = () => {
    return this.notes.value.length;
  };
}

export function setNotesContext() {
  const notes = new Notes();
  return setContext(NOTES_KEY, notes);
}
export function getNotesContext() {
  return getContext<NotesType>(NOTES_KEY);
}
