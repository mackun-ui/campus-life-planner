import { state } from "./state.js";
import { validateField } from "./validators.js";

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = document.getElementById("formMsg");
  msg.textContent = "";
  msg.style.color = "red";

  const title = form.title.value.trim();
  const dueDate = form.dueDate.value.trim();
  const duration = form.duration.value.trim();
  const tag = form.tag.value.trim();

  // Run each field through validators.js
  const validations = [
    { name: "title", value: title },
    { name: "dueDate", value: dueDate },
    { name: "duration", value: duration },
    { name: "tag", value: tag }
  ];

  for (const field of validations) {
    const valid = validateField(field.name, field.value);
    if (!valid) {
      msg.textContent = `Invalid ${field.name}. Please check the format.`;
      msg.style.color = "red";
      msg.focus();
      return; // Stop submission on first invalid field
    }
  }

  // Additional advanced regex check for duplicate words (title)
  const dupWordRe = /\b(\w+)\s+\1\b/;
  if (dupWordRe.test(title)) {
    msg.textContent = "Title contains duplicate words (e.g., 'meet meet').";
    msg.style.color = "red";
    return;
  }

  // Passed validation — continue saving
  msg.textContent = "";
  msg.style.color = "green";

  const id = params.get("id");
  const now = new Date().toISOString();

  const newEvent = {
    id: id || `evt_${Date.now()}`,
    title,
    dueDate,
    duration: parseFloat(duration),
    tag,
    createdAt: id ? state.events.find(e => e.id === id).createdAt : now,
    updatedAt: now
  };

  if (id) {
    const idx = state.events.findIndex(e => e.id === id);
    state.events[idx] = newEvent;
    msg.textContent = "Event updated successfully.";
  } else {
    state.events.push(newEvent);
    msg.textContent = "Event added successfully.";
  }

  save(state.events);
  msg.style.color = "green";
  msg.setAttribute("role", "status");
  msg.setAttribute("aria-live", "polite");

  form.reset();
});
