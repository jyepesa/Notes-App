const createNoteBtn = document.getElementById("create-note");
const cardsWrap = document.getElementById("cards");
const noteTitleInput = document.getElementById("note-title");
const deleteBtn = document.getElementById("delete-note");
const saveBtn = document.getElementById("save-note");
const noteInput = document.getElementById("note-body");

const notesArray = [];

function idAssign() {
  let id = 0;
  if (notesArray.length < 1) {
    return id;
  }
  while (notesArray.some((obj) => obj.id === id)) {
    id++;
  }
  return id;
}

function createNote() {
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

  const noteObj = {
    id: idAssign(),
    title: noteTitleInput.value,
    content: noteInput.value,
    lastUpdate: LastUpdateDate,
    timeStamp: date.getTime(),
  };
  notesArray.push(noteObj);
  notesArray.sort((a, b) => b - a);
  return noteObj;
}

function createCard({ id, title, content, lastUpdate }) {
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

  cardsWrap.prepend(card);
}

saveBtn.addEventListener("click", () => createCard(createNote()));
