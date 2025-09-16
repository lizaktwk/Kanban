// DOM & Rendering
// This is the view -> it knows about the DOM but not how tasks are managed

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  loadTasks,
} from "./tasks.js";

const todoColumn = document.getElementById("todo-column");
const inProgressColumn = document.getElementById("in-progress-column");
const doneColumn = document.getElementById("done-column");
const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => {
  console.log("Add Task Button Clicked");
  createTaskElement(null, true);
  // renderTasks();
});

// ----- Initialization -----
loadTasks();
renderTasks();

// ----- Render Tasks -----
export function renderTasks() {
  // remove any previously rendered task nodes
  todoColumn.querySelectorAll(".task").forEach((n) => n.remove());
  inProgressColumn.querySelectorAll(".task").forEach((n) => n.remove());
  doneColumn.querySelectorAll(".task").forEach((n) => n.remove());

  // clearColumns();

  const tasks = getTasks();
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    if (task.status === "todo") {
      todoColumn.appendChild(taskElement);
    } else if (task.status === "in-progress") {
      inProgressColumn.appendChild(taskElement);
    } else if (task.status === "done") {
      doneColumn.appendChild(taskElement);
    }
  });
}

// ----- Clear Columns and redefine headers -----
// function clearColumns() {
//   todoColumn.innerHTML = `<div class="column-header" id="todo">
//     <h2>To Do</h2>
//     <button id="add-task-btn">+</button>
//   </div>`;
//   inProgressColumn.innerHTML = `<div class="column-header" id="in-progress">
//     <h2>In Progress</h2>
//   </div>`;
//   doneColumn.innerHTML = `<div class="column-header" id="done">
//     <h2>Done</h2>
//   </div>`;
// }

// ----- Create Task Element -----
export function createTaskElement(task, isForm = false) {
  // console.log("Creating task element for:", task, "isForm:", isForm);
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  if (isForm) {
    todoColumn.appendChild(taskDiv);
    console.log("Creating form element");
    taskDiv.setAttribute("id", "add-task");
    taskDiv.innerHTML = `
        <textarea type="text" placeholder="Task Title" class="task-title"></textarea>
        <button class="save-task-btn" type="submit">Save</button>
        <button class="delete-task">
            <img src="assets/delete.png" alt="Delete Icon">
        </button>
        <textarea placeholder="Describe Your Task" class="task-description"></textarea>
    `;

    const saveBtn = taskDiv.querySelector(".save-task-btn");
    const deleteBtn = taskDiv.querySelector(".delete-task");

    saveBtn.addEventListener("click", () => {
      const titleInput = taskDiv.querySelector(".task-title").value;
      const descriptionInput = taskDiv.querySelector(".task-description").value;
      if (titleInput && descriptionInput) {
        console.log("titleInput:", titleInput);
        console.log("descriptionInput:", descriptionInput);
        // Create a new task and add it to the todo column
        const newTask = createTask(titleInput, descriptionInput);
        const formElement = createTaskElement(newTask, false);
        // todoColumn.appendChild(formElement);
        renderTasks();
        taskDiv.remove();
      }
    });

    deleteBtn.addEventListener("click", () => {
      taskDiv.remove();
      deleteTask(task.id);
    });
  } else {
    taskDiv.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <button class="edit-task"> <img src="assets/edit.png" alt="Edit Icon"></button>
        <button class="delete-task"> <img src="assets/delete.png" alt="Delete Icon"></button>
        <p class="task-description">${task.description}</p>
      `;
    const editBtn = taskDiv.querySelector(".edit-task");
    const deleteBtn = taskDiv.querySelector(".delete-task");
    editBtn.addEventListener("click", () => {
      console.log("Edit button clicked for task:", task);
      editTaskElement(task);
      taskDiv.remove();
    });
    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
      taskDiv.remove();
    });
  }
  return taskDiv;
}

function editTaskElement(task) {
  const { title, description } = task;

  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  todoColumn.appendChild(taskDiv);
  console.log("Editing form element");
  taskDiv.setAttribute("id", "add-task");
  taskDiv.innerHTML = `
        <textarea type="text" placeholder="Task Title" class="task-title">${title}</textarea>
        <button class="save-task-btn" type="submit">Save</button>
        <button class="delete-task">
            <img src="assets/delete.png" alt="Delete Icon">
        </button>
        <textarea placeholder="Describe Your Task" class="task-description">${description}</textarea>
    `;

  const saveBtn = taskDiv.querySelector(".save-task-btn");
  const deleteBtn = taskDiv.querySelector(".delete-task");

  saveBtn.addEventListener("click", () => {
    const titleInput = taskDiv.querySelector(".task-title").value;
    const descriptionInput = taskDiv.querySelector(".task-description").value;
    if (titleInput && descriptionInput) {
      const updatedTask = updateTask(task.id, {
        title: titleInput,
        description: descriptionInput,
      });
      renderTasks();
      taskDiv.remove();
    }
  });

  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
    taskDiv.remove();
  });
}

// ------Testing-------
if (import.meta.url.includes("ui.js")) {
  console.log("--- Testing ui.js functions ---");
  //   loadTasks();
  renderTasks();
}
