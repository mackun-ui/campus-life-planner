import { state } from "./state.js";

const upcomingList = document.getElementById("upcomingList");
const totalEvents = document.getElementById("totalEvents");
const totalDuration = document.getElementById("totalDuration");
const topTag = document.getElementById("topTag");
const trendChart = document.getElementById("trendChart");

function renderUpcoming() {
  const now = new Date();
  const upcoming = state.events
    .filter(e => new Date(e.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  upcomingList.innerHTML = upcoming.length
    ? upcoming.map(e => `<li><strong>${e.title}</strong> – ${e.dueDate}</li>`).join("")
    : "<li>No upcoming events.</li>";
}

function renderStats() {
  totalEvents.textContent = state.events.length;
  totalDuration.textContent = state.events.reduce((sum, e) => sum + Number(e.duration), 0);
  
  // Top tag
  const tagCount = {};
  state.events.forEach(e => tagCount[e.tag] = (tagCount[e.tag] || 0) + 1);
  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0];
  topTag.textContent = top ? top[0] : "N/A";

  renderTrend();
}

function renderTrend() {
  const days = Array(7).fill(0);
  const now = new Date();

  state.events.forEach(e => {
    const diff = Math.floor((now - new Date(e.dueDate)) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) days[6 - diff]++;
  });

  trendChart.innerHTML = days
    .map(count => `<div class="bar" style="height:${count * 20}px"></div>`)
    .join("");
}

renderUpcoming();
renderStats();
