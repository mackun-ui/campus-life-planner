import { highlight } from "./search.js";

export function renderTable(tasks, re = null) {
  const tbody = document.querySelector("#taskTable tbody");
  tbody.innerHTML = "";

  tasks.forEach(task => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${highlight(task.title, re)}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration}</td>
      <td>${highlight(task.tag, re)}</td>
      <td><button data-id="${task.id}" class="delete-btn">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}
