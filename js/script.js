const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const list = document.getElementById("todoList");
const empty = document.getElementById("emptyState");
const warning = document.getElementById("warning");
const filters = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");


let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value === "" || dateInput.value === "") {
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
  saveAndRender();
});

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

function render() {
  list.innerHTML = "";

  let filteredTodos = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  empty.style.display = filteredTodos.length === 0 ? "block" : "none";

  themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeToggle.textContent = "☀️ Light";
    localStorage.setItem("theme", "light");
  } else {
    themeToggle.textContent = "🌙 Dark";
    localStorage.setItem("theme", "dark");
  }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️ Light";
}

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <div>
        <strong>${todo.text}</strong><br>
        <small>${todo.date}</small>
      </div>
      <div class="actions">
        <button class="check">✔</button>
        <button class="delete">✖</button>
      </div>
    `;

    li.querySelector(".check").onclick = () => toggleTodo(todo.id);
    li.querySelector(".delete").onclick = () => deleteTodo(todo.id);

    list.appendChild(li);
  });
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

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

render();



