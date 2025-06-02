const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const container = document.getElementById("notes-container");
const boardTitle = document.getElementById("board-title");
const toggleDark = document.getElementById("toggle-dark");

const colors = [
  "#f9e784",
  "#ffd1dc",
  "#b8e2f2",
  "#c8facc",
  "#ffe1a8",
  "#dab6f4",
  "#c4f4ee"
];

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let title = localStorage.getItem("boardTitle") || "My Memo Board";

boardTitle.textContent = title;
renderNotes();

boardTitle.addEventListener("input", () => {
  localStorage.setItem("boardTitle", boardTitle.textContent);
});

toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleDark.textContent = document.body.classList.contains("dark")
    ? "Switch to Light Mode"
    : "Toggle Dark Mode";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;

  const note = {
    text,
    liked: false,
    likes: 0,
    color: colors[Math.floor(Math.random() * colors.length)]
  };

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  input.value = "";
  renderNotes();
});

function renderNotes() {
  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = `<p style="text-align:center; opacity:0.6;">Your board is empty. Add your first note!</p>`;
    return;
  }

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.style.backgroundColor = note.color;
    div.setAttribute("draggable", true);

    div.innerHTML = `
      <div>${note.text}</div>
      <div class="note-actions">
        <button onclick="toggleLike(${index})" class="${note.liked ? 'liked' : ''}">♥ ${note.likes}</button>
        <button onclick="deleteNote(${index})">&times;</button>
      </div>
    `;

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    container.appendChild(div);
  });
}

container.addEventListener("dragover", (e) => e.preventDefault());

container.addEventListener("drop", (e) => {
  const draggedIndex = e.dataTransfer.getData("text");
  const target = e.target.closest(".note");
  const targetIndex = Array.from(container.children).indexOf(target);

  if (targetIndex !== -1 && draggedIndex !== targetIndex) {
    const moved = notes.splice(draggedIndex, 1)[0];
    notes.splice(targetIndex, 0, moved);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
});

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

function toggleLike(index) {
  const note = notes[index];
  note.liked = !note.liked;
  note.likes += note.liked ? 1 : -1;
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}
