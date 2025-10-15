import { validateField } from "./validators.js";
import { renderTable } from "./ui.js";
import { compileRegex } from "./search.js";

let tasks = [];

const form = document.getElementById("taskForm");
const formStatus = document.getElementById("formStatus");
const tableBody = document.querySelector("#taskTable tbody");

function uid() {
  return "task_" + Math.random().toString(36).slice(2, 9);
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    id: uid(),
    title: form.title.value.trim(),
    dueDate: form.dueDate.value,
    duration: form.duration.value,
    tag: form.tag.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const invalids = Object.keys(data).filter(key => {
    if (["id", "createdAt", "updatedAt"].includes(key)) return false;
    return !validateField(key, data[key]);
  });

  if (invalids.length > 0) {
    formStatus.textContent = `Invalid field(s): ${invalids.join(", ")}`;
    formStatus.style.color = "red";
    return;
  }

  tasks.push(data);
  renderTable(tasks);
  form.reset();
  formStatus.textContent = "Task added successfully!";
  formStatus.style.color = "green";
});

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", e => {
  const pattern = e.target.value;
  const re = compileRegex(pattern);
  const filtered = re
    ? tasks.filter(
        t =>
          re.test(t.title) ||
          re.test(t.tag) ||
          re.test(t.dueDate) ||
          re.test(String(t.duration))
      )
    : tasks;
  renderTable(filtered, re);
});