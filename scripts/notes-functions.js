'use strict';

//? Fetch existing notes  from localStorage
const getSavedNotes = () => {
  const notesJSON = localStorage.getItem('notes');
  // if the JSON data in local storage is invalid then catch the error and return an empty array
  try {
    return notesJSON ? JSON.parse(notesJSON) : [];
  } catch (e) {
    return [];
  }
};

//? Save notes to local storage (sync with the 'notes' array)
const saveNotesLS = (notes) => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

//? Remove note from 'notes' array (saveNotesLS() will update/sync the 'notes' array in local storage)
const removeNote = (id) => {
  const noteIndex = notes.findIndex((note) => note.id === id);
  if (noteIndex > -1) {
    notes.splice(noteIndex, 1);
  }
};

//? Generate the DOM structure for a note
const generatedNoteDOM = (note) => {
  const noteEl = document.createElement('a');
  const textEl = document.createElement('p');
  const statusEl = document.createElement('p');

  // Setup the link
  noteEl.setAttribute('href', `/edit.html#${note.id}`);
  noteEl.classList.add('list-item');

  // Create the note title text
  if (note.title.trim().length) {
    textEl.textContent = note.title;
  } else {
    textEl.textContent = 'Unnamed note';
  }
  textEl.classList.add('list-item__title');
  noteEl.appendChild(textEl);

  // Setup the status message
  statusEl.textContent = generateLastEdited(note.updatedAt);
  statusEl.classList.add('list-item__subtitle');
  noteEl.appendChild(statusEl);

  return noteEl;
};

//? Sort notes by one of three options
const sortNotes = (notes, sortBy) => {
  return notes.sort((a, b) => {
    switch (sortBy) {
      case 'byEdited':
        return b.updatedAt - a.updatedAt;
      case 'byCreated':
        return b.createdAt - a.createdAt;
      case 'alphabetical':
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  });
};

//? Render application notes based on filters
const renderNotes = (notes, filters) => {
  const notesEl = document.querySelector('#notes');

  // clear all notes on screen
  notesEl.innerHTML = '';
  // sort the notes
  notes = sortNotes(notes, filters.sortBy);
  // new array of filtered notes
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.searchText.toLowerCase()));
  // display (filtered) list of notes (or message if there are none)
  if (filteredNotes.length > 0) {
    filteredNotes.forEach((note) => {
      const noteEl = generatedNoteDOM(note);
      notesEl.appendChild(noteEl);
    });
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No notes to show';
    emptyMessage.classList.add('empty-message');
    notesEl.appendChild(emptyMessage);
  }
};

//? Generate 'Last edited...' message
const generateLastEdited = (timestamp) => {
  return `Last edited ${moment(timestamp).fromNow()}`;
};