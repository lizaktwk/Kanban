// Data & State Management
// This is the model -> it knows about tasks but not about the DOM

// object structure for a task as reference only
const task = {
  id: "",
  title: "",
  description: "",
  status: "", // 'todo', 'in-progress', 'done'
};

// array to hold tasks
let tasks = [];

export function getTasks() {
  return [...tasks];
}

export function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
export function loadTasks() {
  const tasksJSON = localStorage.getItem("tasks");
  if (tasksJSON) {
    tasks = JSON.parse(tasksJSON);
  } else {
    tasks = [];
  }
}

// function to create a new task
export function createTask(title, description) {
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status: "todo",
  };
  addTask(newTask);
  saveTasks();
  return newTask;
}

export function addTask(newTask) {
  tasks.push(newTask);
  saveTasks();
}

export function updateTask(id, updatedFields) {
  // find the task by id
  const task = tasks.find((t) => t.id === id);
  if (task) {
    // this method copies properties from updatedFields to task
    Object.assign(task, updatedFields);
    saveTasks();
  } else {
    console.error(`Task with id ${id} not found`);
  }
}

export function deleteTask(id) {
  // find the task by id and remove it from the array by filtering it out
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
}

export function moveTask(id, newStatus) {
  updateTask(id, { status: newStatus });
  saveTasks();
}

function resetTasks() {
  tasks = [];
  saveTasks();
}

// --- Test block ---
// if (import.meta.url.includes("tasks.js")) {
//   console.log("--- Testing tasks.js functions ---");

//   loadTasks(); // make sure tasks array is initialized

//   const t1 = createTask("Test Task 1", "This is a test");
//   const t2 = createTask("Test Task 2", "Another test");

//   console.log("All tasks after creation:", getTasks());

//   updateTask(t1.id, { title: "Updated Task 1" });
//   console.log("After update:", getTasks());

//   moveTask(t2.id, "done");
//   console.log("After move:", getTasks());

//   deleteTask(t1.id);
//   console.log("After delete:", getTasks());

//   resetTasks();
//   console.log("After reset:", getTasks());
// }
