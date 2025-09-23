const createNoteBtn = document.getElementById("create-note");
const cardsWrap = document.getElementById("cards");
const noteTitleInput = document.getElementById("note-title");
const deleteBtn = document.getElementById("delete-note");
const saveBtn = document.getElementById("save-note");
const noteInput = document.getElementById("note-body");

let notesArray = [];
let alreadyClicked = false;
let selectedId;

//This function assigns an unassignen ID to new objects

function idAssign() {
  let id = 1;
  if (notesArray.length < 1) {
    return id;
  }
  while (notesArray.some((obj) => obj.id === id)) {
    id++;
  }
  return id;
}

// This function creates or updates a note object and saves it in the notesArray and the localStorage

function createNote(id, clicked) {
  if (!noteTitleInput.value || !noteInput.value) {
    alert("Please enter a title and a note");
    return;
  }
  const date = new Date();
  const LastUpdateDate = `${date.getDate()}.${
    date.getUTCMonth() + 1
  }.${date.getFullYear()}, ${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  }`;

  let noteObj;

  if (clicked) {
    notesArray = notesArray.filter((obj) => obj.id !== id);
    noteObj = {
      id,
      title: noteTitleInput.value,
      content: noteInput.value,
      lastUpdate: LastUpdateDate,
      timeStamp: date.getTime(),
    };
  } else {
    noteObj = {
      id: idAssign(),
      title: noteTitleInput.value,
      content: noteInput.value,
      lastUpdate: LastUpdateDate,
      timeStamp: date.getTime(),
    };
  }
  notesArray.push(noteObj);
  notesArray.sort((a, b) => b.timeStamp - a.timeStamp);
  localStorage.setItem("notes", JSON.stringify(notesArray));
  return noteObj;
}

//This function renders the note object as a card into the DOM

function renderCard({ id, title, content, lastUpdate }) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", id);

  const cardTitle = document.createElement("h3");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = title;

  const cardContent = document.createElement("p");
  cardContent.classList.add("card-note");
  cardContent.textContent = content;

  const cardDate = document.createElement("span");
  cardDate.classList.add("card-date");
  cardDate.textContent = lastUpdate;

  card.appendChild(cardTitle);
  card.appendChild(cardContent);
  card.appendChild(cardDate);

  card.addEventListener("click", () => {
    clickHandler(card);
  });

  return card;
}

//This function updates already existing cards in the DOM

function updateCardsDOM({ title, content, lastUpdate }) {
  const clickedElement = document.querySelector(".clicked");
  clickedElement.childNodes[0].innerText = title;
  clickedElement.childNodes[1].innerText = content;
  clickedElement.childNodes[2].innerText = lastUpdate;
  cardsWrap.prepend(clickedElement);
  clickedElement.classList.remove("clicked");
}

// click handler that takes care of toggling the clicked attribute and making the note editable

function clickHandler(card) {
  removeClicked();
  card.classList.add("clicked");
  alreadyClicked = true;
  selectedId = parseInt(card.getAttribute("data-id"));
  noteTitleInput.value = card.childNodes[0].innerText;
  noteInput.value = card.childNodes[1].innerText;
}

function removeClicked() {
  const cards = document.querySelectorAll("[data-id]");
  for (let element of cards) {
    if (element.classList.contains("clicked")) {
      element.classList.remove("clicked");
    }
  }
}

// function assigned to the "write new note" button. Clears both inputs and returns values to default

function writeNewNote() {
  removeClicked();
  noteTitleInput.value = "";
  noteInput.value = "";
  alreadyClicked = false;
  selectedId = null;
}

function deleteNote(id) {
  if (!alreadyClicked) {
    noteTitleInput.value = "";
    noteInput.value = "";
    alert("Please select a note to delete");
    return;
  } else {
    notesArray = notesArray.filter((card) => id !== card.id);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    const elementToRemove = document.querySelector(".clicked");
    cardsWrap.removeChild(elementToRemove);
    noteTitleInput.value = "";
    noteInput.value = "";
    alreadyClicked = false;
    selectedId = null;
  }
}

function renderFromStorage() {
  const notesToRender = localStorage.getItem("notes");
  if (!notesToRender) {
    return;
  } else {
    notesArray = JSON.parse(notesToRender);
    notesArray.forEach((note) => {
      cardsWrap.append(renderCard(note));
    });
  }
}

document.addEventListener("DOMContentLoaded", renderFromStorage);
saveBtn.addEventListener("click", () => {
  if (!alreadyClicked) {
    cardsWrap.prepend(renderCard(createNote(selectedId, alreadyClicked)));
  } else {
    updateCardsDOM(createNote(selectedId, alreadyClicked));
  }
  noteTitleInput.value = "";
  noteInput.value = "";
  alreadyClicked = false;
});

createNoteBtn.addEventListener("click", writeNewNote);
deleteBtn.addEventListener("click", () => deleteNote(selectedId));
