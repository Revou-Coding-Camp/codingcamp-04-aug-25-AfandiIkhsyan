document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("taskList");
  const noTaskMessage = document.getElementById("noTaskMessage");
  const deleteAllButton = document.getElementById("deleteAllButton");
  const filterButton = document.getElementById("filterButton");

  let tasks = [];

  // menyimpan tugas ke Local Storage
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // memuat tugas dari Local Storage
  const loadTasks = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
  };

  // merender daftar tugas di UI
  const renderTasks = (filteredTasks = tasks) => {
    taskList.innerHTML = "";
    if (filteredTasks.length === 0) {
      taskList.innerHTML = `<tr id="noTaskMessage"><td colspan="4" style="text-align: center;">No task found</td></tr>`;
    } else {
      filteredTasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${task.text}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.completed ? "Completed" : "Pending"}</td>
                    <td>
                        <button class="complete-btn" onclick="completeTask(${index})">Complete</button>
                        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                    </td>
                `;
        if (task.completed) {
          row.style.textDecoration = "line-through";
          row.style.color = "#888";
        }
        taskList.appendChild(row);
      });
    }
    saveTasks();
  };

  // fungsi untuk menambahkan tugas baru
  const addTask = () => {
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value;

    // validasi input
    if (taskText === "" || dueDate === "") {
      alert("Please enter a task and a due date.");
      return;
    }

    const newTask = {
      text: taskText,
      dueDate: dueDate,
      completed: false,
    };
    tasks.push(newTask);
    taskInput.value = "";
    dateInput.value = "";
    renderTasks();
  };

  // menghubungkan fungsi ke tombol
  addButton.addEventListener("click", addTask);

  // m semua tugas
  deleteAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      tasks = [];
      renderTasks();
    }
  });

  // filtering
  let isFiltered = false;
  filterButton.addEventListener("click", () => {
    isFiltered = !isFiltered;
    if (isFiltered) {
      const pendingTasks = tasks.filter((task) => !task.completed);
      renderTasks(pendingTasks);
      filterButton.textContent = "SHOW ALL";
    } else {
      renderTasks();
      filterButton.textContent = "FILTER";
    }
  });

  // fungsi ke window agar bisa diakses dari onclick di HTML
  window.completeTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
  };

  // muat tugas saat halaman dimuat
  loadTasks();
  renderTasks();
});
