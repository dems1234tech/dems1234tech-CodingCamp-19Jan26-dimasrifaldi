const form = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Render on load
renderTodos(todos);

// Add Todo
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!todoInput.value || !dateInput.value) {
    alert("Please fill all fields!");
    return;
  }

  const todo = {
    id: Date.now(),
    text: todoInput.value,
    date: dateInput.value,
    completed: false,
  };

  todos.push(todo);
  saveAndRender();

  todoInput.value = "";
  dateInput.value = "";
});

// Render Function
function renderTodos(data) {
  todoList.innerHTML = "";

  data.forEach((todo) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    li.innerHTML = `
      <span>${todo.text} - ${todo.date}</span>
      <div class="actions">
        <button onclick="toggleTodo(${todo.id})">✓</button>
        <button class="delete" onclick="deleteTodo(${todo.id})">X</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// Save + Render
function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
}

// Delete
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveAndRender();
}

// Toggle Complete
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveAndRender();
}

// Filter
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;

    if (type === "all") renderTodos(todos);
    if (type === "active") renderTodos(todos.filter((t) => !t.completed));
    if (type === "completed") renderTodos(todos.filter((t) => t.completed));
  });
});
