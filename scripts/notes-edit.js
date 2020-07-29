'use strict';

const noteTitleEl = document.querySelector('#note-title');
const noteBodyEl = document.querySelector('#note-body');
const removeNoteBtn = document.querySelector('#remove-note');
const lastEditedEl = document.querySelector('#last-edited');

// get note's id from the hash (removing the # symbol)
const noteId = location.hash.substring(1);
// fetch all notes from local storage
let notes = getSavedNotes();
// retrieve note that matches hash id
let note = notes.find((note) => note.id === noteId);

// if it doesn't exist return user to homepage
if (!note) {
  location.assign('/index.html');
}

noteTitleEl.value = note.title;
noteBodyEl.value = note.body;
lastEditedEl.textContent = generateLastEdited(note.updatedAt);

noteTitleEl.addEventListener('input', (e) => {
  // save input value to note as you type
  note.title = e.target.value;
  note.updatedAt = moment().valueOf();
  lastEditedEl.textContent = generateLastEdited(note.updatedAt);
  saveNotesLS(notes);
});
noteBodyEl.addEventListener('input', (e) => {
  note.body = e.target.value;
  note.updatedAt = moment().valueOf();
  lastEditedEl.textContent = generateLastEdited(note.updatedAt);
  saveNotesLS(notes);
});
removeNoteBtn.addEventListener('click', (e) => {
  removeNote(note.id);
  saveNotesLS(notes);
  location.assign('/index.html');
});

// will update/sync all windows/tabs when data is changed in another window/tab by listening for changes to the data in local storage
window.addEventListener('storage', (e) => {
  // only interested in the 'notes' key in local storage (there could be others)
  if (e.key === 'notes') {
    // update 'notes' array to match the mutated notes array in local storage
    notes = JSON.parse(e.newValue);

    note = notes.find((note) => note.id === noteId);

    // if it doesn't exist return user to homepage
    if (!note) {
      location.assign('/index.html');
    }

    // update the UI as the data in local storage changes
    noteTitleEl.value = note.title;
    noteBodyEl.value = note.body;
    lastEditedEl.textContent = generateLastEdited(note.updatedAt);
  }
});