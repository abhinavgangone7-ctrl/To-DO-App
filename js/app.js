// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// 2. State & LocalStorage Persistence
let tasks = loadTasksFromStorage();

function loadTasksFromStorage() {
  const saved = localStorage.getItem('todo_tasks');
  return saved ? JSON.parse(saved) : [];
}

function saveTasksToStorage() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

// 3. Render a single task object to DOM
function renderTask(taskObj) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = taskObj.completed;

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  if (taskObj.completed) {
    textSpan.classList.add('completed');
  }
  textSpan.textContent = taskObj.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '&times;';

  // Toggle completion state
  checkbox.addEventListener('change', () => {
    taskObj.completed = checkbox.checked;
    textSpan.classList.toggle('completed', checkbox.checked);
    saveTasksToStorage();
  });

  // Delete task item
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== taskObj.id);
    li.remove();
    saveTasksToStorage();
  });

  // Event: Inline edit on double-click
  textSpan.addEventListener('dblclick', () => {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = taskObj.text;

    // Helper to commit edits and restore span
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

    // Save edit on Enter key press
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishEditing();
      }
    });

    // Save edit when user clicks outside the input (blur)
    editInput.addEventListener('blur', finishEditing);

    // Swap textSpan with editInput and auto-focus
    li.replaceChild(editInput, textSpan);
    editInput.focus();
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
}

// 4. Initial Load: Render saved tasks on page startup
tasks.forEach(task => renderTask(task));

// 5. Add Task Handler
function handleAddTask() {
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task name first!');
    return;
  }

  // Create new task object
  const newTask = {
    id: Date.now(), // Unique ID using current timestamp
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTask(newTask);

  taskInput.value = '';
}

// 6. Event Listeners
addBtn.addEventListener('click', handleAddTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleAddTask();
  }
});