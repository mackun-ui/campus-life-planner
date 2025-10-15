import { validateField } from "./validators.js";
import { state } from "./state.js";

const form = document.getElementById("eventForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    id: "evt_" + Math.random().toString(36).slice(2, 8),
    title: form.title.value.trim(),
    dueDate: form.dueDate.value,
    duration: Number(form.duration.value),
    tag: form.tag.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const invalids = Object.keys(data).filter(
    k => !["id", "createdAt", "updatedAt"].includes(k) && !validateField(k, data[k])
  );

  if (invalids.length) {
    msg.textContent = `Invalid: ${invalids.join(", ")}`;
    msg.style.color = "red";
    return;
  }

  state.addEvent(data);
  msg.textContent = "Event saved!";
  msg.style.color = "green";
  form.reset();
});