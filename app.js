// Controller & Events
// This is the controller -> glues the model (tasks.js) and view (ui.js) together

import {
  loadTasks,
  saveTasks,
  createTask,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
} from "./tasks.js";
import { renderTasks, createTaskElement } from "./ui.js";
