
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
const deleteAllBtn = document.querySelector(".delete-all");
let indexToBeDeleted = null
let deleteMode = "single"; // "single" or "all"

// Add event listener to the form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);
deleteAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) return; // nothing to delete

  deleteMode = "all";
  confirmEl.style.display = "block";
  taskManagerContainer.classList.add("overlay");
});

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const taskInput = document.getElementById('taskInput');
  const dueDateInput = document.getElementById('dueDateInput');
  let taskText = taskInput.value.trim();
  let dueDate = dueDateInput.value; // YYYY-MM-DD format

  if(taskText.length > 0){
    taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1);
  }

  if (taskText !== '') {
    const newTask = {
      text: taskText,
      completed: false,
      dueDate: dueDate || null
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    dueDateInput.value = '';
    renderTasks();
  }
}

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial rendering of tasks
renderTasks();


// Function to render tasks
function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  // Sort tasks by due date (earliest first)
  tasks.sort((a, b) => {
    if (!a.dueDate) return 1; // tasks without date go last
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard');
    let classVal = "pending";
    let textVal = "Pending"
    if (task.completed) {
      classVal = "completed";
      textVal = "Completed";
    }
    taskCard.classList.add(classVal);

    // Task text
    const taskText = document.createElement('p');
    taskText.innerText = task.text;

    // Task status
    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = textVal;
    // Due date - bottom right
    const taskDueDate = document.createElement('p');
    taskDueDate.classList.add('due-date');
    taskDueDate.innerText = task.dueDate ? `Due: ${task.dueDate}` : '';

    // Toggle button (existing code)
    const toggleButton = document.createElement('button');
    toggleButton.classList.add("button-box");
    const btnContentEl = document.createElement("span");
    btnContentEl.classList.add("green");
    btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
    toggleButton.appendChild(btnContentEl);
    toggleButton.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Delete button (existing code)
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("button-box");
    const delBtnContentEl = document.createElement("span");
    delBtnContentEl.classList.add("red");
    delBtnContentEl.innerText = 'Delete';
    deleteButton.appendChild(delBtnContentEl);
    deleteButton.addEventListener('click', () => {
      indexToBeDeleted = index;
      deleteMode = "single";
      confirmEl.style.display = "block";
      taskManagerContainer.classList.add("overlay");
    });

    // Append elements in order
    taskCard.appendChild(taskText);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(deleteButton);
    taskCard.appendChild(taskDueDate); 
    taskContainer.appendChild(taskCard); // append last, bottom-right
    });
}

// function to delete the selected task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

confirmedBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");

  if (deleteMode === "all") {
    tasks = [];
    saveTasks();
    renderTasks();
  } else {
    deleteTask(indexToBeDeleted);
  }

  deleteMode = "single"; // reset
});

cancelledBtn.addEventListener("click", () => {
  confirmEl.style.display = "none";
  taskManagerContainer.classList.remove("overlay");
});