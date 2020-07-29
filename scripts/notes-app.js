'use strict';

// populate 'notes' array with saved data in localStorage if it exists
let notes = getSavedNotes();

const filters = {
  searchText: '',
  sortBy: 'byEdited',
};

// init display of notes
renderNotes(notes, filters);

document.querySelector('#create-note').addEventListener('click', (e) => {
  // add note to 'notes' array
  const id = uuidv4();
  const timestamp = moment().valueOf();

  notes.push({
    id: id,
    title: '',
    body: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  saveNotesLS(notes);
  // redirect to edit page for new note
  location.assign(`/edit.html#${id}`);
});

document.querySelector('#search-text').addEventListener('input', (e) => {
  filters.searchText = e.target.value;
  renderNotes(notes, filters);
});

document.querySelector('#filter-by').addEventListener('change', (e) => {
  filters.sortBy = e.target.value;
  renderNotes(notes, filters);
});

// watch for changes to local storage data (from other windows or tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'notes') {
    // update 'notes' array to match the mutated notes array in local storage
    notes = JSON.parse(e.newValue);
    // re-render page with new 'notes' array data
    renderNotes(notes, filters);
  }
});