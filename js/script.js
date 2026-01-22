const form = document.getElementById("todoForm");
const list = document.getElementById("todoList");
const progressBar = document.getElementById("progressBar");
const filters = document.querySelectorAll(".filter button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

/* ADD */
form.addEventListener("submit", e => {
  e.preventDefault();

  const task = taskInput.value;
  const date = dateInput.value;
  const priority = priorityInput.value;

  if (!task || !date) return alert("Fill all fields!");

  todos.push({
    id: Date.now(),
    task,
    date,
    priority,
    completed: false
  });

  save();
});

/* FILTER */
filters.forEach(btn => {
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  };
});

/* DELETE */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
}

/* TOGGLE COMPLETE */
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  todo.completed = !todo.completed;
  save();
}

/* RENDER */
function render() {
  list.innerHTML = "";

  let filtered = todos.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    if (t.completed) li.classList.add("completed");

    li.innerHTML = `
      <div>
        <strong>${t.task}</strong><br>
        <small>${t.date}</small>
        <span class="badge ${t.priority}">${t.priority}</span>
      </div>
      <div class="actions">
        <button onclick="toggleTodo(${t.id})">✔</button>
        <button onclick="deleteTodo(${t.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

/* PROGRESS */
function updateProgress() {
  const done = todos.filter(t => t.completed).length;
  const percent = todos.length ? (done / todos.length) * 100 : 0;
  progressBar.style.width = percent + "%";
}

/* SAVE */
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  form.reset();
  render();
}

render();
