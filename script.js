let userInput = document.getElementById("user-input");
let addbtn = document.getElementById("add");
let cancelbtn = document.getElementById("cancel");
let todoSection = document.getElementById("todo-section");

let allToDos = []; // Array to hold all todos
let editingTaskId = null; // Track which task is currently being edited

// ===============================
// Load todos from localStorage on startup
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const stored = JSON.parse(localStorage.getItem("todos")) || [];
  allToDos = stored;
  renderTodos(); // rebuild UI
});

// ===============================
// Keyboard functions
// ===============================
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddOrUpdate(userInput.value.trim());
  }

  if (event.key === "Backspace" && event.ctrlKey) {
    clearInput();
  }
});

// ===============================
// Add button click
// ===============================
addbtn.addEventListener("click", () => {
  handleAddOrUpdate(userInput.value.trim());
});

// ===============================
// Cancel button click
// ===============================
cancelbtn.addEventListener("click", () => {
  clearInput();
});

// ===============================
// Clear input field
// ===============================
function clearInput() {
  userInput.value = "";

  if (editingTaskId !== null) {
    const checkbox = document.getElementById(editingTaskId);
    if (checkbox) {
      const todoCard = checkbox.parentElement;
      todoCard.style.opacity = "1";
      checkbox.disabled = false;
    }
  }

  editingTaskId = null;
  addbtn.textContent = "ADD";
}

// ===============================
// Decide whether to add or update
// ===============================
function handleAddOrUpdate(value) {
  if (value === "") return;

  if (editingTaskId !== null) {
    UpdateValue(value); // update existing task
  } else {
    addInput(value); // create new task
  }
  saveTodos(); // save after any change
}

// ===============================
// Add a new todo
// ===============================
function addInput(value) {
  const newTask = {
    name: value,
    completed: false,
    id: Date.now(), // unique id
  };

  allToDos.push(newTask);
  createTodoCard(newTask);

  clearInput();
  saveTodos();
}

// ===============================
// Create Todo Card in DOM
// ===============================
function createTodoCard(task) {
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.id = task.id;
  checkbox.classList.add("checkbox");

  let todoCard = document.createElement("div");
  let todoValue = document.createElement("p");
  let deletebtn = document.createElement("button");
  let editbtn = document.createElement("button");

  todoCard.classList.add("todo-card");
  todoValue.classList.add("todo");
  deletebtn.classList.add("delete");
  editbtn.classList.add("edit");

  todoValue.textContent = task.name;
  deletebtn.textContent = "Delete";
  editbtn.textContent = "Edit";

  todoCard.appendChild(checkbox);
  todoCard.appendChild(todoValue);
  todoCard.appendChild(deletebtn);
  todoCard.appendChild(editbtn);

  todoSection.appendChild(todoCard);

  // strike-through if already completed
  if (task.completed) {
    todoValue.style.textDecoration = "line-through";
    todoValue.style.color = "rgb(110, 110, 110)";
  }

  // ===============================
  // Delete button
  // ===============================
  deletebtn.addEventListener("click", () => {
    todoSection.removeChild(todoCard);
    allToDos = allToDos.filter((t) => t.id !== task.id);
    saveTodos();
  });

  // ===============================
  // Checkbox toggle (strike-through)
  // ===============================
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    if (checkbox.checked) {
      todoValue.style.textDecoration = "line-through";
      todoValue.style.color = "rgb(110, 110, 110)";
      todoValue.style.backgroundColor = "rgba(84, 84, 84, 0.44)";
    } else {
      todoValue.style.textDecoration = "none";
      todoValue.style.color = "black";
      todoValue.style.backgroundColor = "white";
    }
    saveTodos();
  });

  // ===============================
  // Edit button
  // ===============================
  editbtn.addEventListener("click", () => startEditing(task.id, todoCard));
}

// ===============================
// Render todos from array
// ===============================
function renderTodos() {
  todoSection.innerHTML = ""; // clear current
  allToDos.forEach((task) => createTodoCard(task));
}

// ===============================
// Start editing a todo
// ===============================
function startEditing(taskId, todoCard) {
  const task = allToDos.find((t) => t.id === taskId);
  if (!task) return;

  userInput.value = task.name;
  userInput.focus();

  editingTaskId = taskId;
  addbtn.textContent = "Update";

  todoCard.style.opacity = "0.3";
  const checkbox = document.getElementById(taskId);
  if (checkbox) checkbox.disabled = true;
}

// ===============================
// Update an existing todo
// ===============================
function UpdateValue(value) {
  const task = allToDos.find((t) => t.id === editingTaskId);
  if (!task) return;

  task.name = value;

  const checkbox = document.getElementById(task.id);
  const todoCard = checkbox.parentElement;
  const todoValue = todoCard.querySelector(".todo");
  todoValue.textContent = value;

  todoCard.style.opacity = "1";
  checkbox.disabled = false;

  clearInput();
  saveTodos();
}

// ===============================
// Save todos to localStorage
// ===============================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allToDos));
}
