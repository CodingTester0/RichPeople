const apiBase = window.SNAPAPP_API_BASE || window.location.origin;
const clientsEl = document.querySelector("#clients");
const rowsEl = document.querySelector("#rows");
let rows = [];
let clients = [];
const pendingText = new Map();
const focusedTextareas = new Set();

function apiUrl(path) {
  return new URL(path, apiBase).toString();
}

function renderClients() {
  if (!clients.length) {
    clientsEl.innerHTML = '<div class="empty">No clients connected.</div>';
    return;
  }

  clientsEl.replaceChildren(
    ...clients.map((client) => {
      const card = document.createElement("div");
      card.className = "client";
      card.innerHTML = `
        <strong>${client.label || client.clientId}</strong>
        <span class="meta">${client.clientId} · ${client.rowCount || 0} visible rows</span>
      `;
      return card;
    }),
  );
}

function updateLiveText(row, text) {
  pendingText.set(row.key, text);
  const request = new XMLHttpRequest();
  request.open("POST", apiUrl("/api/live-row-text"), true);
  request.setRequestHeader("content-type", "application/json");
  request.send(JSON.stringify({
    clientId: row.clientId,
    rowIndex: row.rowIndex,
    text,
  }));
}

function renderRows() {
  if (!rows.length) {
    rowsEl.innerHTML = '<div class="empty">No rows marked visible yet.</div>';
    return;
  }

  rowsEl.replaceChildren(
    ...rows.map((row) => {
      const card = document.createElement("div");
      card.className = "row-card";
      const title = document.createElement("strong");
      title.textContent = row.name || "Unnamed";
      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = `${row.clientLabel || row.clientId} · row ${row.rowIndex + 1}`;
      const input = document.createElement("textarea");
      input.placeholder = "Write live status text...";
      input.value = pendingText.has(row.key) ? pendingText.get(row.key) : row.liveText || "";
      input.dataset.key = row.key;
      input.addEventListener("focus", () => focusedTextareas.add(row.key));
      input.addEventListener("blur", () => {
        focusedTextareas.delete(row.key);
        pendingText.delete(row.key);
      });
      input.addEventListener("input", () => updateLiveText(row, input.value));
      card.append(title, meta, input);
      return card;
    }),
  );
}

async function loadState() {
  const response = await fetch(apiUrl("/api/live-state"));
  const state = await response.json();
  clients = state.clients || [];
  rows = (state.rows || []).map((row) => ({ ...row, key: `${row.clientId}:${row.rowIndex}` }));
  renderClients();
  renderRows();
}

function connectEvents() {
  const events = new EventSource(apiUrl("/api/events"));
  events.addEventListener("live-state", (event) => {
    const state = JSON.parse(event.data);
    clients = state.clients || [];
    rows = (state.rows || []).map((row) => ({ ...row, key: `${row.clientId}:${row.rowIndex}` }));
    renderClients();
    if (!document.activeElement?.matches("textarea")) {
      renderRows();
    }
  });
}

loadState();
connectEvents();
