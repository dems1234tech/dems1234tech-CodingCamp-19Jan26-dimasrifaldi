const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const list = document.getElementById("todoList");
const empty = document.getElementById("emptyState");
const warning = document.getElementById("warning");
const filters = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

/* THEME */
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️ Light";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", light ? "light" : "dark");
};

/* FORM */
form.onsubmit = e => {
  e.preventDefault();

  if (!input.value || !dateInput.value) {
    warning.style.display = "block";
    return;
  }

  warning.style.display = "none";

  todos.push({
    id: Date.now(),
    text: input.value,
    date: dateInput.value,
    completed: false
  });

  input.value = "";
  dateInput.value = "";
  save();
};

/* FILTER */
filters.forEach(btn => {
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

function render() {
  list.innerHTML = "";

  const filtered = todos.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <div>
        <span class="task-text">${todo.text}</span><br>
        <small>${todo.date}</small>
      </div>
      <div class="actions">
        <button>✔</button>
        <button>✖</button>
      </div>
    `;

    li.querySelector(".actions button:first-child").onclick = () => toggle(todo.id);
    li.querySelector(".actions button:last-child").onclick = () => removeTodo(todo.id);

    li.querySelector(".task-text").ondblclick = e => editTodo(e.target, todo);

    list.appendChild(li);
  });
}

function editTodo(el, todo) {
  const inputEdit = document.createElement("input");
  inputEdit.value = todo.text;
  inputEdit.className = "edit-input";
  el.replaceWith(inputEdit);
  inputEdit.focus();

  inputEdit.onblur = saveEdit;
  inputEdit.onkeydown = e => e.key === "Enter" && saveEdit();

  function saveEdit() {
    todo.text = inputEdit.value.trim() || todo.text;
    save();
  }
}

function toggle(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
}

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

render();

