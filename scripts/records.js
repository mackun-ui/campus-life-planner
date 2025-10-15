import { state } from "./state.js";
import { compileRegex, highlight } from "./search.js";

const tableBody = document.querySelector("#eventsTable tbody");
const search = document.getElementById("search");

const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
const unit = settings.unit || "minutes";

function formatDuration(value) {
  const n = Number(value) || 0;
  return unit === "hours" ? (n / 60).toFixed(2) + "h" : n + " min";
}

function render(events, re = null) {
  tableBody.innerHTML = "";
  events.forEach(e => {
    const displayDuration = formatDuration(e.duration);
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

search.addEventListener("input", () => {
  const re = compileRegex(search.value);
  const filtered = re
    ? state.events.filter(e => re.test(e.title) || re.test(e.tag) || re.test(e.dueDate))
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

// Sorting: use state.events (not a local `tasks`) and the module's render
document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    const direction = th.dataset.dir === "asc" ? "desc" : "asc";
    th.dataset.dir = direction;

    const events = [...state.events];
    events.sort((a, b) => {
      if (key === "duration") {
        return direction === "asc" ? Number(a.duration) - Number(b.duration) : Number(b.duration) - Number(a.duration);
      }
      if (key === "dueDate") {
        return direction === "asc" ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
      }
      return direction === "asc"
        ? String(a[key] || "").localeCompare(String(b[key] || ""))
        : String(b[key] || "").localeCompare(String(a[key] || ""));
    });

    render(events);
  });
});

render(state.events);

