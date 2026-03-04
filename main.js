// Constantes y selección de elementos del DOM
const API_URL = "https://taskmanager-pg-back.onrender.com/tasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchTasks);
addBtn.addEventListener("click", addTask);

// También permitimos agregar tareas presionando "Enter"
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// GET - Obtener y mostrar
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error de conexión con la API:", error);
  }
}

// POST - Crear tarea
async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return; // Si está vacío, no hace nada

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    });

    if (response.ok) {
      taskInput.value = ""; // Limpia el input
      fetchTasks(); // Recarga la lista
    }
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
}

// DELETE - Eliminar tarea
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchTasks();
    }
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
  }
}

// Función para pintar el HTML dinámicamente
function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");

    tasks.forEach((task) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = task.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteTask(task.id);

      li.appendChild(span);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
}
