export function applySavedTheme() {
  const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
  const theme = settings.theme || "light";
  document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");
}
