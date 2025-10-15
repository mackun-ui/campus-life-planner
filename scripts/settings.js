import { state } from "./state.js";

const unitSelect = document.getElementById("unitSelect");
const maxEventsInput = document.getElementById("maxEvents");
const themeSelect = document.getElementById("themeSelect"); // new for light/dark
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const clearBtn = document.getElementById("clearBtn");
const statusMsg = document.getElementById("statusMsg");

const SETTINGS_KEY = "campusPlanner:settings";

let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

unitSelect.value = settings.unit || "minutes";
maxEventsInput.value = settings.maxEvents || "";
themeSelect.value = settings.theme || "light";
applyTheme(settings.theme || "light");

function saveSettings() {
  settings.unit = unitSelect.value;
  settings.maxEvents = Number(maxEventsInput.value) || null;
  settings.theme = themeSelect.value || "light";
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyTheme(settings.theme);
  statusMsg.textContent = "Settings saved!";
  statusMsg.style.color = "green";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  document.body.classList.toggle("light-theme", theme === "light");
}

unitSelect.addEventListener("change", saveSettings);
maxEventsInput.addEventListener("change", saveSettings);
themeSelect.addEventListener("change", saveSettings);

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.events, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "campus-events.json";
  a.click();
});

importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("Invalid file format");
      state.events = data;
      localStorage.setItem("campusPlanner:data", JSON.stringify(data));
      statusMsg.textContent = "Import successful!";
      statusMsg.style.color = "green";
    } catch {
      statusMsg.textContent = "Error importing file.";
      statusMsg.style.color = "red";
    }
  };
  reader.readAsText(file);
});

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all events?")) {
    localStorage.removeItem("campusPlanner:data");
    state.events = [];
    statusMsg.textContent = "All data cleared.";
    statusMsg.style.color = "orange";
  }
});
