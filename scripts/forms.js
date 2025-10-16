import { state } from "./state.js";

const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
const maxEvents = settings.maxEvents || null;
const unit = settings.unit || "minutes";

const form = document.getElementById("eventForm");
const msg = document.getElementById("formMsg");
const submitBtn = form.querySelector('button[type="submit"]');

// Generate sequential IDs like event_001, event_002, ...
function generateEventId() {
  const existing = new Set(state.events.map(e => e.id));
  // Find highest numeric suffix among ids that match event_###
  let max = 0;
  state.events.forEach(e => {
    const m = /^event_(\d+)$/.exec(e.id);
    if (m) {
      const n = Number(m[1]);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  });
  // Start from max+1 and ensure it's unique (in case other ids collide)
  let next = max + 1;
  let id = '';
  do {
    id = `event_${String(next).padStart(3, '0')}`;
    next++;
  } while (existing.has(id));
  return id;
}

// Helper to read query params
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// If we're editing an existing event, populate the form
const editId = getQueryParam('id');
let editing = false;
let originalCreatedAt = null;
if (editId) {
  const ev = state.events.find(e => e.id === editId);
  if (ev) {
    editing = true;
    originalCreatedAt = ev.createdAt || null;
    form.title.value = ev.title || '';
    form.dueDate.value = ev.dueDate || '';
    form.duration.value = ev.duration || '';
    form.tag.value = ev.tag || '';
    submitBtn.textContent = 'Update Event';
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();

  if (!editing && maxEvents && state.events.length >= maxEvents) {
    msg.textContent = `Cannot add more than ${maxEvents} events.`;
    msg.style.color = "red";
    return;
  }

  const now = new Date().toISOString();
  const data = {
    id: editing ? editId : generateEventId(),
    title: form.title.value.trim(),
    dueDate: form.dueDate.value,
    duration: Number(form.duration.value),
    tag: form.tag.value.trim(),
    createdAt: editing ? (originalCreatedAt || now) : now,
    updatedAt: now
  };

  if (editing) {
    state.updateEvent(data);
    msg.textContent = "Event updated!";
  } else {
    state.addEvent(data);
    msg.textContent = "Event saved!";
    form.reset();
  }
  msg.style.color = "green";
});
