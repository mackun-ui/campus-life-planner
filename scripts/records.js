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
  if (!events || events.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" class="no-events">No events currently.</td>`;
    tableBody.appendChild(tr);
    return;
  }

  events.forEach(e => {
    const displayDuration = formatDuration(e.duration);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${highlight(e.title, re)}</td>
      <td>${e.dueDate}</td>
      <td>${displayDuration}</td>
      <td>${highlight(e.tag, re)}</td>
    <td>
      <button class="edit" data-id="${e.id}">Edit</button>
      <button class="delete" data-id="${e.id}">Delete</button>
    </td>
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
  // Edit action: navigate to the form with the event id
  if (e.target.classList.contains("edit")) {
    const id = e.target.dataset.id;
    // open the form page with ?id=...
    window.location.href = `forms.html?id=${encodeURIComponent(id)}`;
    return;
  }

  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    // Ask for confirmation before deleting
    const ok = window.confirm("Are you sure you want to delete this event?");
    if (!ok) return;
    state.deleteEvent(id);
    render(state.events);
  }
});


document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    // Toggle direction and clear other headers' indicators
    const direction = th.dataset.dir === "asc" ? "desc" : "asc";
    document.querySelectorAll("th[data-sort]").forEach(t => {
      if (t === th) {
        t.dataset.dir = direction;
        t.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
      } else {
        delete t.dataset.dir;
        t.removeAttribute('aria-sort');
      }
    });

    const events = [...state.events];
    events.sort((a, b) => {
      if (key === "duration") {
        return direction === "asc" ? Number(a.duration) - Number(b.duration) : Number(b.duration) - Number(a.duration);
      }
      if (key === "dueDate") {
        // Sort by date (newest/oldest depending on direction)
        return direction === "asc" ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
      }
      // default: string compare (title, tag)
      const av = String(a[key] || "").toLowerCase();
      const bv = String(b[key] || "").toLowerCase();
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });

    render(events);
  });
});

render(state.events);

