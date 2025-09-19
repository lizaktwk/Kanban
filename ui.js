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
      if (titleInput) {
        console.log("titleInput:", titleInput);
        console.log("descriptionInput:", descriptionInput);
        // Create a new task and add it to the todo column
        const newTask = createTask(titleInput, descriptionInput);
        const formElement = createTaskElement(newTask, false);
        renderTasks();
        taskDiv.remove();
      }
    });

    deleteBtn.addEventListener("click", () => {
      taskDiv.remove();
      deleteTask(task.id);
    });
  } else {
    taskDiv.dataset.id = task.id;
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
  taskDiv.dataset.id = task.id;
  const oldTaskDiv = document.querySelector(`[data-id="${task.id}"]`);
  if (oldTaskDiv) {
    oldTaskDiv.replaceWith(taskDiv);
  } else {
    todoColumn.appendChild(taskDiv);
  }

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
    if (titleInput) {
      updateTask(task.id, {
        title: titleInput,
        description: descriptionInput,
      });
      renderTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
    renderTasks();
  });
}

// ----- Drag and Drop with Interact.js -----

//Make all tasks draggable
interact(".task").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "#kanban-board",
      endOnly: true,
    }),
  ],
  autoScroll: true,
  listeners: { move: dragMoveListener },
});

// Define how tasks move while dragging
function dragMoveListener(event) {
  const target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.transform = "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// Enable dropzones for each column
interact(".column").dropzone({
  accept: ".task",
  overlap: 0.5,

  ondragenter(event) {
    event.target.classList.add("drop-target");
    event.relatedTarget.classList.add("can-drop");
  },
  ondragleave(event) {
    event.target.classList.remove("drop-target");
    event.relatedTarget.classList.remove("can-drop");
  },
  ondrop(event) {
    const taskEl = event.relatedTarget;
    const newColumn = event.target;

    // reset dragging transform
    taskEl.style.transform = "translate(0px, 0px)";
    taskEl.removeAttribute("data-x");
    taskEl.removeAttribute("data-y");

    // move task into the column
    newColumn.appendChild(taskEl);

    // update task status in storage
    if (newColumn.id === "todo-column") {
      moveTask(taskEl.dataset.id, "todo");
    } else if (newColumn.id === "in-progress-column") {
      moveTask(taskEl.dataset.id, "in-progress");
    } else if (newColumn.id === "done-column") {
      moveTask(taskEl.dataset.id, "done");
    }

    // re-render tasks so everything stays consistent
    renderTasks();
  },
  ondropdeactivate(event) {
    event.target.classList.remove("drop-active");
    event.target.classList.remove("drop-target");
  },
});

// ------Testing-------
if (import.meta.url.includes("ui.js")) {
  console.log("--- Testing ui.js functions ---");
  //   loadTasks();
  renderTasks();
}
