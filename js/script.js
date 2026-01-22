const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const list = document.getElementById("todoList");
const empty = document.getElementById("emptyState");
const filters = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value || !dateInput.value) return;

  todos.push({
    id: Date.now(),
    text: input.value,
    date: dateInput.value,
    completed: false
  });

  input.value = "";
  dateInput.value = "";
  save();
});

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
        <strong>${todo.text}</strong><br>
        <small>${todo.date}</small>
      </div>
      <div class="actions">
        <button onclick="toggle(${todo.id})">✔</button>
        <button onclick="removeTodo(${todo.id})">✖</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggle(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
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
