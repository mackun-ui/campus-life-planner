import { state } from "./state.js";
import { compileRegex, highlight } from "./search.js";

const tableBody = document.querySelector("#eventsTable tbody");
const search = document.getElementById("search");

function render(events, re = null) {
  tableBody.innerHTML = "";
  events.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${highlight(e.title, re)}</td>
      <td>${e.dueDate}</td>
      <td>${e.duration}</td>
      <td>${highlight(e.tag, re)}</td>
      <td><button class="delete" data-id="${e.id}">🗑</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

search.addEventListener("input", () => {
  const re = compileRegex(search.value);
  const filtered = re
    ? state.events.filter(e =>
        re.test(e.title) || re.test(e.tag) || re.test(e.dueDate))
    : state.events;
  render(filtered, re);
});

tableBody.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    state.deleteEvent(id);
    render(state.events);
  }
});

const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
const unit = settings.unit || "minutes";

function render(events, re = null) {
  tableBody.innerHTML = "";
  events.forEach(e => {
    const displayDuration = unit === "hours" ? (e.duration/60).toFixed(2) + "h" : e.duration + " min";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${highlight(e.title, re)}</td>
      <td>${e.dueDate}</td>
      <td>${displayDuration}</td>
      <td>${highlight(e.tag, re)}</td>
      <td><button class="delete" data-id="${e.id}">🗑</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    const direction = th.dataset.dir === "asc" ? "desc" : "asc";
    th.dataset.dir = direction;

    tasks.sort((a, b) => {
      if (key === "duration") return direction === "asc" ? a.duration - b.duration : b.duration - a.duration;
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    renderTable(tasks);
  });
});


render(state.events);

