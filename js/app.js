// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Progress Bar DOM Elements
const progressText = document.getElementById('progressText');
const progressCount = document.getElementById('progressCount');
const progressBarFill = document.getElementById('progressBarFill');

// 2. State & LocalStorage Persistence
let tasks = loadTasksFromStorage();

function loadTasksFromStorage() {
  const saved = localStorage.getItem('todo_tasks');
  return saved ? JSON.parse(saved) : [];
}

function saveTasksToStorage() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

// Helper to show/hide the empty state message
function updateEmptyState() {
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

// Helper to recalculate & animate progress bar
function updateProgressBar() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBarFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% Completed`;
  progressCount.textContent = `${completed} of ${total} tasks`;
}

// Helper to re-render task list UI after reordering
function refreshTaskListUI() {
  saveTasksToStorage();
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task));
  updateEmptyState();
  updateProgressBar();
}

// Celebration Ribbon & Toast Trigger
function triggerCelebration(message) {
  let toast = document.querySelector('.celebration-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'celebration-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);

  const palette = ['#2373F4', '#578EF5', '#65D0F4', '#25d325', '#facc15', '#ff4757'];
  for (let i = 0; i < 30; i++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'confetti-ribbon';

    const width = Math.random() * 8 + 6;
    const height = Math.random() * 16 + 12;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.4;

    ribbon.style.width = `${width}px`;
    ribbon.style.height = `${height}px`;
    ribbon.style.backgroundColor = color;
    ribbon.style.left = `${left}vw`;
    ribbon.style.animationDelay = `${delay}s`;

    document.body.appendChild(ribbon);

    setTimeout(() => {
      ribbon.remove();
    }, 2200);
  }
}

// 3. Render a single task object to DOM
function renderTask(taskObj) {
  const li = document.createElement('li');
  li.className = 'task-item';

  // Reorder Arrows Container
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

  upBtn.addEventListener('click', () => {
    const index = tasks.findIndex(t => t.id === taskObj.id);
    if (index > 0) {
      const temp = tasks[index - 1];
      tasks[index - 1] = tasks[index];
      tasks[index] = temp;
      refreshTaskListUI();
    }
  });

  downBtn.addEventListener('click', () => {
    const index = tasks.findIndex(t => t.id === taskObj.id);
    if (index < tasks.length - 1) {
      const temp = tasks[index + 1];
      tasks[index + 1] = tasks[index];
      tasks[index] = temp;
      refreshTaskListUI();
    }
  });

  reorderContainer.appendChild(upBtn);
  reorderContainer.appendChild(downBtn);

  // Checkbox element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = taskObj.completed;

  // Task text span
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  if (taskObj.completed) {
    textSpan.classList.add('completed');
  }
  textSpan.textContent = taskObj.text;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';

  // Toggle completion state & update progress bar
  checkbox.addEventListener('change', () => {
    taskObj.completed = checkbox.checked;
    textSpan.classList.toggle('completed', checkbox.checked);
    saveTasksToStorage();
    updateProgressBar(); // Update progress bar

    if (checkbox.checked) {
      triggerCelebration('🎉 Yay! Task accomplished!');
    }
  });

  // Delete task item & update progress bar
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== taskObj.id);
    li.remove();
    saveTasksToStorage();
    updateEmptyState();
    updateProgressBar(); // Update progress bar
  });

  // Inline edit on double-click
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
        saveTasksToStorage();
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

  // Assemble elements in order
  li.appendChild(reorderContainer);
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

// 4. Initial Load: Render saved tasks, update empty state & progress bar
tasks.forEach(task => renderTask(task));
updateEmptyState();
updateProgressBar();

// 5. Add Task Handler
function handleAddTask() {
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task name first!');
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTask(newTask);
  updateEmptyState();
  updateProgressBar(); // Update progress bar when task added

  taskInput.value = '';
}

// 6. Event Listeners
addBtn.addEventListener('click', handleAddTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleAddTask();
  }
});

// Clear Completed Button Listener
clearCompletedBtn.addEventListener('click', () => {
  const hasCompleted = tasks.some(t => t.completed);

  if (hasCompleted) {
    tasks = tasks.filter(task => !task.completed);
    refreshTaskListUI();
    triggerCelebration('✨ Great job! Completed tasks cleared!');
  }
});