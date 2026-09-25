// Main Application Entry Point
import { loadTasksFromStorage, saveTasksToStorage } from './storage.js';
import { triggerCelebration } from './celebration.js';
import { renderTask, updateEmptyState, updateProgressBar, refreshTaskListUI, sortTasksCompletedToBottom } from './ui.js';

// DOM Selectors
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Global Application State
let tasks = loadTasksFromStorage();

// Setter helper so imported UI module can update tasks state
function setTaskState(newTasks) {
  tasks = newTasks;
}

// 1. Initial Page Load Execution (Sorted completed to bottom)
sortTasksCompletedToBottom(tasks);
refreshTaskListUI(tasks, setTaskState);

// 2. Add New Task Handler (Supports Single & Bulk Paste Entry via Commas or Newlines)
function handleAddTask() {
  const rawInput = taskInput.value.trim();

  if (rawInput === '') {
    alert('Please enter a task name first!');
    return;
  }

  // Split by commas or newlines (handles multiple lines/commas & strips spaces)
  const taskItems = rawInput
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);

  if (taskItems.length === 0) return;

  // Add each task item individually
  taskItems.forEach((text, index) => {
    const newTask = {
      id: Date.now() + index, // Ensure unique timestamp IDs in bulk loop
      text: text,
      completed: false
    };

    tasks.push(newTask);
  });

  // Keep completed tasks at bottom after adding new tasks
  sortTasksCompletedToBottom(tasks);
  refreshTaskListUI(tasks, setTaskState);

  taskInput.value = '';
}

// 3. Global Event Listeners
addBtn.addEventListener('click', handleAddTask);

// Enter key submits (Shift+Enter creates a new line in textarea)
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleAddTask();
  }
});

// Clear Completed Action Listener
clearCompletedBtn.addEventListener('click', () => {
  const hasCompleted = tasks.some(t => t.completed);

  if (hasCompleted) {
    tasks = tasks.filter(task => !task.completed);
    refreshTaskListUI(tasks, setTaskState);
    triggerCelebration('✨ Great job! Completed tasks cleared!');
  }
});