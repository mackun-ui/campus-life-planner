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
  
  const tagCount = {};
  state.events.forEach(e => tagCount[e.tag] = (tagCount[e.tag] || 0) + 1);
  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0];
  topTag.textContent = top ? top[0] : "N/A";

  renderTrend();
}

function renderTrend() {
  // Build last-7-days date keys (from 6 days ago to today)
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    days.push(d);
  }

  // Helper: format a Date to local YYYY-MM-DD (avoids timezone shifts from toISOString)
  function formatLocalYMD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Collect tags and counts per day (normalize event dates to local YMD)
  const tagSet = new Set();
  const counts = days.map(d => {
    const key = formatLocalYMD(d);
    const map = {};
    state.events.forEach(e => {
      if (!e || !e.dueDate) return;
      const evDate = new Date(e.dueDate);
      if (isNaN(evDate)) return;
      const evKey = formatLocalYMD(evDate);
      if (evKey !== key) return;
      const t = e.tag || 'Other';
      tagSet.add(t);
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  });

  const tags = Array.from(tagSet);
  // assign colors to tags (deterministic HSL)
  const tagColors = {};
  tags.forEach((t, i) => {
    const h = (i * 55) % 360;
    tagColors[t] = `hsl(${h} 70% 55%)`;
  });

  // Totals per day for scaling
  const totals = counts.map(m => Object.values(m).reduce((s, v) => s + v, 0));
  const maxTotal = Math.max(...totals, 1);

  // Size: use container width so chart fits card
  const rect = trendChart.getBoundingClientRect();
  const paddingX = 16;
  const width = Math.max(Math.floor(rect.width - paddingX * 2), 320);
  const height = 160;
  const labelArea = 20;
  const innerH = height - labelArea - 8;
  const barW = Math.floor(width / days.length);

  // Build SVG groups (stacked bars)
  const bars = days.map((d, di) => {
    const dayMap = counts[di];
    let stackY = innerH; // start from bottom
    const segments = [];
    tags.forEach(t => {
      const val = dayMap[t] || 0;
      if (val === 0) return;
      const h = Math.round((val / maxTotal) * innerH);
      const x = di * barW + paddingX / 2;
      const y = (height - labelArea - 8) - (innerH - stackY) - h + 8;
      segments.push(`<rect x="${x}" y="${y}" width="${barW - 8}" height="${h}" rx="3" fill="${tagColors[t]}"></rect>`);
      stackY -= h;
    });
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    const group = `
      <g class="bar-group" data-day="${d.toISOString().slice(0,10)}">
        ${segments.join('')}
        <text x="${di * barW + paddingX/2 + (barW - 8)/2}" y="${height - 4}" font-size="10" fill="var(--clr-muted)" text-anchor="middle">${label}</text>
      </g>`;
    return group;
  }).join('');

  // legend
  const legend = tags.map(t => `<span class="legend-item"><span class="legend-swatch" style="background:${tagColors[t]}"></span>${t}</span>`).join('');

  trendChart.innerHTML = `
    <div class="trend-wrapper">
      <div class="trend-legend">${legend}</div>
      <svg class="trend-svg" width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Events by tag in last 7 days">
        ${bars}
      </svg>
    </div>
  `;
}

const settings = JSON.parse(localStorage.getItem("campusPlanner:settings") || "{}");
const unit = settings.unit || "minutes";

document.querySelectorAll(".duration").forEach(el => {
  const duration = Number(el.dataset.duration);
  el.textContent = unit === "hours" ? (duration / 60).toFixed(2) + "h" : duration + " min";
});

renderUpcoming();
renderStats();
