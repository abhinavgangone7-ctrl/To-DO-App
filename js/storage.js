// Storage Module: LocalStorage Persistence
const STORAGE_KEY = 'todo_tasks';

export function loadTasksFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveTasksToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
