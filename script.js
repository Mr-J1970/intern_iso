document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu ul li");
  const sections = document.querySelectorAll(".content-section");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.querySelector(".task-list");
  const newTaskInput = document.getElementById("new-task");
  const taskCategory = document.getElementById("task-category");
  const taskDatetime = document.getElementById("task-datetime");
  const focusedTask = document.getElementById("focused-task");
  const scheduledTasksList = document.querySelector(".scheduled-tasks-list");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === item.getAttribute("data-target")) {
          section.classList.add("active");
        }
      });

      if (item.getAttribute("data-target") === "scheduled-tasks") {
        populateScheduledTasks();
      }
    });
  });

  addTaskButton.addEventListener("click", () => {
    const taskText = newTaskInput.value.trim();
    const category = taskCategory.value;
    const datetime = taskDatetime.value;

    if (taskText && datetime) {
      const taskItem = document.createElement("li");
      taskItem.classList.add(category);
      taskItem.dataset.datetime = datetime;
      taskItem.innerHTML = `
        <span>${taskText}</span>
        <input type="checkbox">
      `;
      taskList.appendChild(taskItem);

      newTaskInput.value = "";
      taskDatetime.value = "";

      taskItem.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          taskItem.classList.add("completed");
          updateFocusedTask();
        } else {
          taskItem.classList.remove("completed");
          updateFocusedTask();
        }
      });

      updateFocusedTask();
    }
  });

  function updateFocusedTask() {
    const tasks = Array.from(taskList.querySelectorAll("li"));
    const incompleteTasks = tasks.filter((task) => !task.querySelector("input").checked);

    if (incompleteTasks.length > 0) {
      focusedTask.textContent = incompleteTasks[0].querySelector("span").textContent;
    } else {
      focusedTask.textContent = "No Task Focused";
    }
  }

  function populateScheduledTasks() {
    scheduledTasksList.innerHTML = ""; 
    const tasks = Array.from(taskList.querySelectorAll("li"));

    if (tasks.length === 0) {
      scheduledTasksList.innerHTML = "<p>No tasks scheduled.</p>";
      return;
    }

    const tasksByDate = {};

    tasks.forEach((task) => {
      const taskDate = new Date(task.dataset.datetime);
      if (!isNaN(taskDate)) {
        const formattedDate = taskDate.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }); 
        if (!tasksByDate[formattedDate]) {
          tasksByDate[formattedDate] = [];
        }
        tasksByDate[formattedDate].push(task);
      }
    });

    Object.keys(tasksByDate)
      .sort((a, b) => new Date(a) - new Date(b)) 
      .forEach((date) => {
        const dateSection = document.createElement("div");
        dateSection.classList.add("date-section");

        const dateHeading = document.createElement("h2");
        dateHeading.textContent = date; 
        dateSection.appendChild(dateHeading);

        const tasksForDate = tasksByDate[date];
        tasksForDate.forEach((task) => {
          const taskTime = new Date(task.dataset.datetime).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }); 

          const taskItem = document.createElement("p");
          taskItem.textContent = `${task.querySelector("span").textContent} (${taskTime})`;
          dateSection.appendChild(taskItem);
        });

        scheduledTasksList.appendChild(dateSection);
      });
  }
});

  


                