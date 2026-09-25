// UI Module: Rendering & View Updates
import { saveTasksToStorage } from './storage.js';
import { triggerCelebration } from './celebration.js';

// Select DOM Elements
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const progressText = document.getElementById('progressText');
const progressCount = document.getElementById('progressCount');
const progressBarFill = document.getElementById('progressBarFill');

// Helper to sort completed tasks to the bottom
export function sortTasksCompletedToBottom(tasks) {
  tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
}

// Update Empty State View
export function updateEmptyState(tasks) {
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

// Update Productivity Progress Bar View
export function updateProgressBar(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBarFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% Completed`;
  progressCount.textContent = `${completed} of ${total} tasks`;
}

// Re-render entire list UI (used during reordering / clearing / sorting)
export function refreshTaskListUI(tasks, setTaskState) {
  saveTasksToStorage(tasks);
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task, tasks, setTaskState));
  updateEmptyState(tasks);
  updateProgressBar(tasks);
}

// Render a Single Task Card
export function renderTask(taskObj, tasks, setTaskState) {
  const li = document.createElement('li');
  li.className = 'task-item';

  // Reorder Controls (Up & Down Arrows)
  const reorderContainer = document.createElement('div');
  reorderContainer.className = 'reorder-controls';

  const upBtn = document.createElement('button');
  upBtn.className = 'reorder-btn';
  upBtn.innerHTML = '▲';
  upBtn.title = 'Move Up';

  const downBtn = document.createElement('button');
  downBtn.className = 'reorder-btn';
  downBtn.innerHTML = '▼';
  downBtn.title = 'Move Down';

  // Move Up Action
  upBtn.addEventListener('click', () => {
    const index = tasks.findIndex(t => t.id === taskObj.id);
    if (index > 0) {
      const temp = tasks[index - 1];
      tasks[index - 1] = tasks[index];
      tasks[index] = temp;
      refreshTaskListUI(tasks, setTaskState);
    }
  });

  // Move Down Action
  downBtn.addEventListener('click', () => {
    const index = tasks.findIndex(t => t.id === taskObj.id);
    if (index < tasks.length - 1) {
      const temp = tasks[index + 1];
      tasks[index + 1] = tasks[index];
      tasks[index] = temp;
      refreshTaskListUI(tasks, setTaskState);
    }
  });

  reorderContainer.appendChild(upBtn);
  reorderContainer.appendChild(downBtn);

  // Checkbox Element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = taskObj.completed;

  // Task Text Span
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  if (taskObj.completed) {
    textSpan.classList.add('completed');
  }
  textSpan.textContent = taskObj.text;

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';

  // Toggle Completion & Auto-Sort Completed to Bottom
  checkbox.addEventListener('change', () => {
    taskObj.completed = checkbox.checked;
    sortTasksCompletedToBottom(tasks);
    refreshTaskListUI(tasks, setTaskState);

    if (checkbox.checked) {
      triggerCelebration('🎉 Yay! Task accomplished!');
    }
  });

  // Delete Task Action
  deleteBtn.addEventListener('click', () => {
    const updatedTasks = tasks.filter(t => t.id !== taskObj.id);
    setTaskState(updatedTasks);
    li.remove();
    saveTasksToStorage(updatedTasks);
    updateEmptyState(updatedTasks);
    updateProgressBar(updatedTasks);
  });

  // Inline Double-Click Edit
  textSpan.addEventListener('dblclick', () => {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = taskObj.text;

    const finishEditing = () => {
      const updatedText = editInput.value.trim();
      if (updatedText !== '') {
        taskObj.text = updatedText;
        textSpan.textContent = updatedText;
        saveTasksToStorage(tasks);
      }
      if (li.contains(editInput)) {
        li.replaceChild(textSpan, editInput);
      }
    };

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finishEditing();
    });

    editInput.addEventListener('blur', finishEditing);

    li.replaceChild(editInput, textSpan);
    editInput.focus();
  });

  // Assemble Elements inside <li>
  li.appendChild(reorderContainer);
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}
