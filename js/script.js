const form = document.getElementById("todoForm");
const taskInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter button");
const counter = document.getElementById("counter");
const clearAllBtn = document.getElementById("clearAll");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!taskInput.value || !dateInput.value) {
    alert("Please fill task and date");
    return;
  }

  todos.push({
    id: Date.now(),
    text: taskInput.value,
    date: dateInput.value,
    completed: false,
  });

  taskInput.value = "";
  dateInput.value = "";
  saveAndRender();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTodos();
  });
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    todos = [];
    saveAndRender();
  }
});

function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    todoList.innerHTML = "<p>No task found</p>";
  }

  filtered.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-info">
        <strong>${todo.text}</strong>
        <small>${todo.date}</small>
      </div>
      <div class="actions">
        <button onclick="toggleTodo(${todo.id})">✔</button>
        <button onclick="deleteTodo(${todo.id})">✖</button>
      </div>
    `;
    todoList.appendChild(li);
  });

  updateCounter();
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveAndRender();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveAndRender();
}

function updateCounter() {
  const active = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  counter.textContent = `Total: ${todos.length} | Active: ${active} | Completed: ${completed}`;
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

renderTodos();
