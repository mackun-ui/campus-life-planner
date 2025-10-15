import { state } from "./state.js";

const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
const maxEvents = settings.maxEvents || null;
const unit = settings.unit || "minutes";

const form = document.getElementById("eventForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();

  if (maxEvents && state.events.length >= maxEvents) {
    msg.textContent = `Cannot add more than ${maxEvents} events.`;
    msg.style.color = "red";
    return;
  }

  const data = {
    id: "evt_" + Math.random().toString(36).slice(2, 8),
    title: form.title.value.trim(),
    dueDate: form.dueDate.value,
    duration: Number(form.duration.value),
    tag: form.tag.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.addEvent(data);
  msg.textContent = "Event saved!";
  msg.style.color = "green";
  form.reset();
});
