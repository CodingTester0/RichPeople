const defaultChats = [
  {
    name: "jonathan",
    message: { state: "delivered", media: "snap", time: "17s", streak: 2 },
    avatar: "J",
    bold: false,
  },
  {
    name: "Emma <3",
    message: { state: "new", media: "snap", time: "just now", streak: 2 },
    avatar: "E",
  },
  {
    name: "nev",
    message: { state: "received", media: "chat", time: "4h", streak: 0 },
    avatar: "N",
  },
  {
    name: "lauren",
    message: { state: "screenshot", media: "snap", time: "2d", streak: 0 },
    avatar: "L",
  },
  {
    name: "Salome K.",
    message: { state: "opened", media: "chat", time: "1d", streak: 0 },
    avatar: "S",
    avatarClass: "blank",
  },
  {
    name: "bri spinelli",
    message: { state: "new", media: "chat", time: "3h", streak: 0 },
    avatar: "B",
  },
  {
    name: "NERA",
    message: { state: "received", media: "snap", time: "1w", streak: 0 },
    avatar: "T",
    bold: false,
  },
  {
    name: "Rasool",
    message: { state: "opened", media: "snap", time: "3w", streak: 0 },
    avatar: "R",
    avatarClass: "blank",
  },
  {
    name: "Joesph Kewley",
    message: { state: "received", media: "snap", time: "6w", streak: 0 },
    avatar: "J",
  },
  {
    name: "NERA",
    message: { state: "received", media: "chat", time: "2h", streak: 0 },
    avatar: "M",
  },
  {
    name: "lince",
    message: { state: "received", media: "snap", time: "9w", streak: 0 },
    avatar: "L",
  },
  {
    name: "camila",
    message: { state: "opened", media: "chat", time: "5h", streak: 0 },
    avatar: "C",
  },
  {
    name: "maria",
    message: { state: "received", media: "snap", time: "12h", streak: 0 },
    avatar: "M",
  },
  {
    name: "alex",
    message: { state: "delivered", media: "chat", time: "1d", streak: 0 },
    avatar: "A",
  },
  {
    name: "sophia",
    message: { state: "opened", media: "snap", time: "5d", streak: 0 },
    avatar: "S",
  },
  {
    name: "natalie",
    message: { state: "received", media: "snap", time: "2w", streak: 0 },
    avatar: "N",
  },
  {
    name: "david",
    message: { state: "new", media: "video", time: "6h", streak: 0 },
    avatar: "D",
  },
  {
    name: "mia",
    message: { state: "screenshot", media: "snap", time: "4w", streak: 0 },
    avatar: "M",
  },
  {
    name: "chris",
    message: { state: "received", media: "snap", time: "7w", streak: 0 },
    avatar: "C",
  },
  {
    name: "layla",
    message: { state: "opened", media: "chat", time: "3d", streak: 0 },
    avatar: "L",
  },
];

const storageKey = "snapapp-people";
const accountStorageKey = "snapapp-account";
const bitmojiLibraryKey = "snapapp-bitmoji-library";
const badgeStorageKey = "snapapp-badge-count";
const chatBadgeStorageKey = "snapapp-chat-badge-count";
const oneYearMs = 365 * 24 * 60 * 60 * 1000;

function readSavedValue(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    if (!parsed) return fallback;
    if (parsed.savedAt && Date.now() - parsed.savedAt > oneYearMs) {
      localStorage.removeItem(key);
      return fallback;
    }
    return parsed.data || parsed;
  } catch {
    return fallback;
  }
}

function writeSavedValue(key, data) {
  localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
}

const savedPeople = readSavedValue(storageKey, []);
const oldDefaultNames = new Set([
  "jonathan",
  "Emma <3",
  "nev",
  "lauren",
  "Salome K.",
  "bri spinelli",
  "Team Snapchat",
  "Rasool",
  "Joesph Kewley",
  "My AI",
  "lince",
  "camila",
  "maria",
  "alex",
  "sophia",
  "natalie",
  "david",
  "mia",
  "chris",
  "layla",
]);
const chats = defaultChats.map((chat, index) => {
  const saved = savedPeople[index] || {};
  const savedName = oldDefaultNames.has(saved.name) ? "NERA" : saved.name;
  return {
    ...chat,
    name: savedName || "NERA",
    avatar: "N",
    avatarUrl: saved.avatarUrl,
    avatarSourceUrl: saved.avatarSourceUrl,
    avatarBg: saved.avatarBg,
    snapchatUsername: saved.snapchatUsername,
    snapchatUrl: saved.snapchatUrl,
    message: saved.message || chat.message,
    liveVisible: Boolean(saved.liveVisible),
    friendEmoji: saved.friendEmoji || chat.friendEmoji || "",
  };
});
const bitmojiLibrary = readSavedValue(bitmojiLibraryKey, []).filter((item) => item?.avatarUrl);
const account = {
  name: "My Account",
  avatar: "A",
  avatarBg: "#eef1f5",
  ...readSavedValue(accountStorageKey, {}),
};

const list = document.querySelector("#chatList");
const composeButton = document.querySelector(".compose-button");
const profileButton = document.querySelector(".avatar-button");
const notificationButton = document.querySelector('.round-button[aria-label="Notifications"]');
const quickAddButton = document.querySelector(".quick-add");
const badge = document.querySelector(".badge");
const chatTabBadge = document.querySelector("#chatTabBadge");
const profileAvatar = document.querySelector(".profile-avatar");
const editor = document.querySelector("#personEditor");
const bitmojiManager = document.querySelector("#bitmojiManager");
const badgeEditor = document.querySelector("#badgeEditor");
const badgeForm = document.querySelector("#badgeForm");
const badgeInput = document.querySelector("#badgeInput");
const chatBadgeEditor = document.querySelector("#chatBadgeEditor");
const chatBadgeForm = document.querySelector("#chatBadgeForm");
const chatBadgeInput = document.querySelector("#chatBadgeInput");
const statusEditor = document.querySelector("#statusEditor");
const statusForm = document.querySelector("#statusForm");
const statusStateInput = document.querySelector("#statusStateInput");
const statusMediaInput = document.querySelector("#statusMediaInput");
const statusTimeInput = document.querySelector("#statusTimeInput");
const statusStreakInput = document.querySelector("#statusStreakInput");
const liveVisibleInput = document.querySelector("#liveVisibleInput");
const statusPresetButtons = document.querySelectorAll("[data-status-preset]");
const randomizerEditor = document.querySelector("#randomizerEditor");
const randomizeButtons = document.querySelectorAll("[data-randomize-range]");
const editorForm = document.querySelector(".editor-panel");
const editorTitle = document.querySelector("#editorTitle");
const nameInput = document.querySelector("#nameInput");
const snapUrlInput = document.querySelector("#snapUrlInput");
const bitmojiBgInput = document.querySelector("#bitmojiBgInput");
const fetchSnapProfile = document.querySelector("#fetchSnapProfile");
const editorPreview = document.querySelector("#editorPreview");
const bitmojiGrid = document.querySelector("#bitmojiGrid");
const profileEmojiGrid = document.querySelector("#profileEmojiGrid");
const managerBitmojiGrid = document.querySelector("#managerBitmojiGrid");
let activeType = "chat";
let activeIndex = 0;
const friendEmojiChoices = ["", "❤️", "💛", "💕", "😎", "😊"];
const clientIdKey = "snapapp-client-id";

function createClientId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const clientId = localStorage.getItem(clientIdKey) || createClientId();
localStorage.setItem(clientIdKey, clientId);

function getApiBase() {
  return window.SNAPAPP_API_BASE || window.location.origin;
}

function createApiUrl(path) {
  return new URL(path, getApiBase());
}

async function postJson(path, data) {
  try {
    await fetch(createApiUrl(path).toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Live admin sync is best-effort and should not block the app UI.
  }
}

function renderBadge() {
  const count = readSavedValue(badgeStorageKey, "1");
  const numericCount = Number(count);
  badge.hidden = numericCount <= 0;
  badge.innerHTML = numericCount <= 0 ? "" : `<span class="badge-number">${String(count)}</span>`;
}

function renderChatBadge() {
  const count = readSavedValue(chatBadgeStorageKey, "1");
  const numericCount = Number(count);
  chatTabBadge.hidden = numericCount <= 0;
  chatTabBadge.textContent = numericCount <= 0 ? "" : String(count);
}

function savePeople() {
  const editableData = chats.map(({ name, avatar, avatarUrl, avatarSourceUrl, avatarBg, snapchatUsername, snapchatUrl, message, liveVisible, friendEmoji }) => ({
    name,
    avatar,
    avatarUrl,
    avatarSourceUrl,
    avatarBg,
    snapchatUsername,
    snapchatUrl,
    message,
    liveVisible,
    friendEmoji,
  }));
  writeSavedValue(storageKey, editableData);
}

function saveAccount() {
  const { name, avatar, avatarUrl, avatarSourceUrl, avatarBg, snapchatUsername, snapchatUrl } = account;
  writeSavedValue(accountStorageKey, { name, avatar, avatarUrl, avatarSourceUrl, avatarBg, snapchatUsername, snapchatUrl });
}

function saveBitmojiLibrary() {
  writeSavedValue(bitmojiLibraryKey, bitmojiLibrary.slice(0, 40));
}

function getInitial(name) {
  return (name || "A").slice(0, 1).toUpperCase();
}

function usernameFromSnapchatValue(value) {
  const rawValue = (value || "").trim();
  if (!rawValue) return "";
  if (rawValue.includes("snapchat.com")) {
    try {
      const url = new URL(rawValue);
      return decodeURIComponent(url.pathname.replace(/^\/@?/, "")).split("/")[0];
    } catch {
      return "";
    }
  }
  return rawValue.replace(/^@/, "").split(/[/?#]/)[0].trim();
}

function snapchatUrlFromUsername(username) {
  const cleanUsername = usernameFromSnapchatValue(username);
  return cleanUsername ? `https://www.snapchat.com/@${encodeURIComponent(cleanUsername)}` : "";
}

function getActivePerson() {
  return activeType === "account" ? account : chats[activeIndex];
}

function createAvatarImage(src, name) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.referrerPolicy = "no-referrer";
  image.addEventListener("error", () => {
    image.remove();
  });
  return image;
}

function fillAvatar(avatar, person) {
  avatar.replaceChildren();
  if (person.avatarUrl) {
    avatar.append(createAvatarImage(person.avatarUrl, person.name));
  } else {
    avatar.textContent = "";
  }
}

function createBitmojiTile(item, options = {}) {
  const button = document.createElement("button");
  button.className = "bitmoji-choice";
  button.type = "button";
  button.setAttribute("aria-label", options.remove ? `Remove ${item.name}` : `Use ${item.name}`);

  const image = createAvatarImage(item.avatarUrl, item.name);
  button.append(image);

  const label = document.createElement("span");
  label.className = "bitmoji-choice-name";
  label.textContent = item.name || item.snapchatUsername || "Bitmoji";
  button.append(label);

  if (options.remove) {
    const remove = document.createElement("span");
    remove.className = "remove-bitmoji";
    remove.textContent = "x";
    button.append(remove);
  }

  return button;
}

function renderEmptyLibrary(container) {
  const empty = document.createElement("div");
  empty.className = "empty-library";
  empty.textContent = "No saved Bitmojis";
  container.replaceChildren(empty);
}

function renderBitmojiPicker() {
  if (!bitmojiLibrary.length) {
    renderEmptyLibrary(bitmojiGrid);
    return;
  }

  bitmojiGrid.replaceChildren(
    ...bitmojiLibrary.map((item) => {
      const button = createBitmojiTile(item);
      button.addEventListener("click", () => {
        const person = getActivePerson();
        if (!person) return;
        person.name = item.name || person.name;
        person.avatar = getInitial(person.name);
        person.avatarUrl = item.avatarUrl;
        person.avatarSourceUrl = item.avatarSourceUrl;
        person.avatarBg = item.avatarBg;
        person.snapchatUsername = item.snapchatUsername;
        person.snapchatUrl = item.snapchatUrl;
        bitmojiBgInput.value = item.avatarBg || "#eef1f5";
        snapUrlInput.value = item.snapchatUsername || "";
        nameInput.value = person.name;
        updatePreview();
        persistActivePerson();
      });
      return button;
    }),
  );
}

function renderProfileEmojiPicker() {
  const person = getActivePerson();
  profileEmojiGrid.replaceChildren(
    ...friendEmojiChoices.map((emoji) => {
      const button = document.createElement("button");
      button.className = ["emoji-badge-choice", (person?.friendEmoji || "") === emoji ? "selected" : ""].filter(Boolean).join(" ");
      button.type = "button";
      button.textContent = emoji || "None";
      button.setAttribute("aria-label", emoji ? `Use ${emoji}` : "Remove badge emoji");
      button.addEventListener("click", () => {
        const activePerson = getActivePerson();
        if (!activePerson) return;
        activePerson.friendEmoji = emoji;
        persistActivePerson();
        renderProfileEmojiPicker();
      });
      return button;
    }),
  );
}

function renderBitmojiManager() {
  if (!bitmojiLibrary.length) {
    renderEmptyLibrary(managerBitmojiGrid);
    return;
  }

  managerBitmojiGrid.replaceChildren(
    ...bitmojiLibrary.map((item) => {
      const button = createBitmojiTile(item, { remove: true });
      button.addEventListener("click", () => {
        const index = bitmojiLibrary.findIndex((saved) => saved.id === item.id);
        if (index >= 0) {
          bitmojiLibrary.splice(index, 1);
          saveBitmojiLibrary();
          renderBitmojiPicker();
          renderBitmojiManager();
        }
      });
      return button;
    }),
  );
}

function addBitmojiToLibrary(person) {
  if (!person.avatarUrl || !person.avatarSourceUrl) return;
  const id = person.snapchatUsername || person.avatarSourceUrl;
  const existingIndex = bitmojiLibrary.findIndex((item) => item.id === id);
  const item = {
    id,
    name: person.name,
    avatarUrl: person.avatarUrl,
    avatarSourceUrl: person.avatarSourceUrl,
    avatarBg: person.avatarBg,
    snapchatUsername: person.snapchatUsername,
    snapchatUrl: person.snapchatUrl,
    savedAt: Date.now(),
  };
  if (existingIndex >= 0) {
    bitmojiLibrary.splice(existingIndex, 1);
  }
  bitmojiLibrary.unshift(item);
  saveBitmojiLibrary();
  renderBitmojiPicker();
}

function renderAccount() {
  fillAvatar(profileAvatar, account);
}

function renderChats() {
  list.replaceChildren(...chats.map(createChatRow));
}

function openEditor(type, index = 0) {
  activeType = type;
  activeIndex = index;
  const person = getActivePerson();
  editorTitle.textContent = type === "account" ? "Edit Account" : "Edit Friend";
  nameInput.value = person.name;
  snapUrlInput.value = person.snapchatUsername || usernameFromSnapchatValue(person.snapchatUrl);
  bitmojiBgInput.value = person.avatarBg || "#eef1f5";
  updatePreview();
  renderBitmojiPicker();
  renderProfileEmojiPicker();
  if (typeof editor.showModal === "function") {
    editor.showModal();
  }
}

function updatePreview() {
  const person = getActivePerson();
  editorPreview.replaceChildren();
  if (person?.avatarUrl) {
    editorPreview.append(createAvatarImage(person.avatarUrl, person.name));
  } else {
    editorPreview.textContent = "";
  }
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function colorDistance(a, b) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function colorAt(data, offset) {
  return {
    r: data[offset],
    g: data[offset + 1],
    b: data[offset + 2],
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The Bitmoji image could not be loaded."));
    image.src = src;
  });
}

async function recolorAvatarBackground(sourceUrl, backgroundColor) {
  const proxyUrl = createApiUrl("/api/avatar-image");
  proxyUrl.searchParams.set("url", sourceUrl);
  const image = await loadImage(proxyUrl.toString());
  const canvas = document.createElement("canvas");
  const size = 220;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, size, size);

  const frame = context.getImageData(0, 0, size, size);
  const data = frame.data;
  const samples = [];
  for (let i = 0; i < size; i += 1) {
    samples.push(colorAt(data, i * 4));
    samples.push(colorAt(data, ((size - 1) * size + i) * 4));
    samples.push(colorAt(data, (i * size) * 4));
    samples.push(colorAt(data, (i * size + size - 1) * 4));
  }

  const oldBg = {
    r: median(samples.map((sample) => sample.r)),
    g: median(samples.map((sample) => sample.g)),
    b: median(samples.map((sample) => sample.b)),
  };
  const newBg = hexToRgb(backgroundColor);
  const visited = new Uint8Array(size * size);
  const shouldReplace = new Uint8Array(size * size);
  const queue = [];

  function addPixel(x, y) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const index = y * size + x;
    if (visited[index]) return;
    visited[index] = 1;
    queue.push(index);
  }

  for (let i = 0; i < size; i += 1) {
    addPixel(i, 0);
    addPixel(i, size - 1);
    addPixel(0, i);
    addPixel(size - 1, i);
  }

  while (queue.length) {
    const index = queue.shift();
    const offset = index * 4;
    const current = colorAt(data, offset);
    if (data[offset + 3] < 8 || colorDistance(current, oldBg) < 76) {
      shouldReplace[index] = 1;
      const x = index % size;
      const y = Math.floor(index / size);
      addPixel(x + 1, y);
      addPixel(x - 1, y);
      addPixel(x, y + 1);
      addPixel(x, y - 1);
    }
  }

  for (let index = 0; index < shouldReplace.length; index += 1) {
    if (!shouldReplace[index]) continue;
    const offset = index * 4;
    data[offset] = newBg.r;
    data[offset + 1] = newBg.g;
    data[offset + 2] = newBg.b;
    data[offset + 3] = 255;
  }

  context.putImageData(frame, 0, 0);
  return canvas.toDataURL("image/png");
}

const messageColors = {
  chat: "#39b2dd",
  snap: "#e82754",
  video: "#9b54a0",
};

const messageStateLabels = {
  new: "New",
  delivered: "Delivered",
  received: "Received",
  opened: "Opened",
  screenshot: "Screenshot",
};

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeMessage(message = {}) {
  return {
    state: message.state || "received",
    media: message.media || "snap",
    time: message.time || "",
    streak: Number(message.streak || 0),
  };
}

function iconForMessage(message) {
  const normalized = normalizeMessage(message);
  const stateName = normalized.state === "new" ? "New" : titleCase(normalized.state);
  const mediaName = normalized.state === "screenshot" && normalized.media === "video" ? "Snap" : titleCase(normalized.media);
  return `icons/${stateName}${mediaName}.png`;
}

function textForMessage(message) {
  const normalized = normalizeMessage(message);
  if (normalized.state === "new") {
    return normalized.media === "chat" ? "New Chat" : "New Snap";
  }
  return messageStateLabels[normalized.state] || "Received";
}

function createMessageMeta(message) {
  const normalized = normalizeMessage(message);
  if (message?.liveText) {
    const meta = document.createElement("span");
    meta.className = "chat-meta live-text";
    meta.textContent = message.liveText;
    return meta;
  }

  const color = messageColors[normalized.media] || "#68707c";
  const meta = document.createElement("span");
  meta.className = "chat-meta";

  const icon = document.createElement("img");
  icon.className = ["status-icon", `status-icon-${normalized.state}-${normalized.media}`].join(" ");
  icon.src = iconForMessage(normalized);
  icon.alt = "";
  meta.append(icon);

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = textForMessage(normalized);
  if (normalized.state === "new") {
    label.classList.add("new-message-label");
    label.style.color = color;
    icon.style.color = color;
  }
  meta.append(label);

  if (normalized.time) {
    const dot = document.createElement("span");
    dot.className = "meta-dot";
    dot.textContent = "·";
    meta.append(dot);

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = normalized.time;
    meta.append(time);
  }

  if (normalized.streak > 0) {
    const dot = document.createElement("span");
    dot.className = "meta-dot";
    dot.textContent = "·";
    meta.append(dot);

    const streak = document.createElement("span");
    streak.className = "streak-count";
    streak.textContent = `${normalized.streak}🔥`;
    meta.append(streak);
  }

  return meta;
}

function replaceRowMeta(rowIndex) {
  const row = list.children[rowIndex];
  if (!row) return;
  const currentMeta = row.querySelector(".chat-meta");
  if (!currentMeta) return;
  currentMeta.replaceWith(createMessageMeta(chats[rowIndex].message));
}

let lastLiveSeq = 0;

function applyLiveTextUpdate(update) {
  if (update.seq) {
    lastLiveSeq = Math.max(lastLiveSeq, update.seq);
  }
  if (update.clientId !== clientId) return;
  const chat = chats[update.rowIndex];
  if (!chat) return;
  chat.message = {
    ...normalizeMessage(chat.message),
    liveText: update.text,
  };
  replaceRowMeta(update.rowIndex);
}

function openStatusEditor(index) {
  activeIndex = index;
  const message = normalizeMessage(chats[index].message);
  statusStateInput.value = message.state;
  statusMediaInput.value = message.media;
  statusTimeInput.value = message.time;
  statusStreakInput.value = String(message.streak || 0);
  liveVisibleInput.checked = Boolean(chats[index].liveVisible);
  if (typeof statusEditor.showModal === "function") {
    statusEditor.showModal();
  }
}

function visibleRowsPayload() {
  return chats
    .map((chat, rowIndex) => ({
      clientId,
      rowIndex,
      name: chat.name,
      liveText: chat.message?.liveText || "",
      visible: Boolean(chat.liveVisible),
    }))
    .filter((row) => row.visible);
}

function publishLiveRows() {
  postJson("/api/live-rows", {
    clientId,
    label: account.name || "SnapApp Client",
    rows: visibleRowsPayload(),
  });
}

function sendPresence() {
  postJson("/api/presence", {
    clientId,
    label: account.name || "SnapApp Client",
    rowCount: visibleRowsPayload().length,
  });
}

function connectLiveEvents() {
  const events = new EventSource(createApiUrl(`/api/events?clientId=${encodeURIComponent(clientId)}`).toString());
  events.addEventListener("live-row-text", (event) => {
    applyLiveTextUpdate(JSON.parse(event.data));
  });
}

async function pollLiveUpdates() {
  try {
    const url = createApiUrl("/api/live-updates");
    url.searchParams.set("clientId", clientId);
    url.searchParams.set("after", String(lastLiveSeq));
    const response = await fetch(url.toString(), { cache: "no-store" });
    const data = await response.json();
    for (const update of data.updates || []) {
      applyLiveTextUpdate(update);
    }
  } catch {
    // Polling is a latency fallback; EventSource may still be connected.
  } finally {
    setTimeout(pollLiveUpdates, 180);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomTimeForRange(range) {
  const ranges = {
    fresh: () => `${randomInt(1, 23)}h`,
    today: () => `${randomInt(1, 23)}h`,
    days: () => `${randomInt(1, 6)}d`,
    weeks: () => `${randomInt(1, 4)}w`,
    old: () => `${randomInt(5, 30)}w`,
  };
  return (ranges[range] || ranges.today)();
}

function randomOrderedTime(range, index, total) {
  const progress = total <= 1 ? 0 : index / (total - 1);
  const orderedRanges = {
    fresh: [
      () => `${randomInt(1, 8)}h`,
      () => `${randomInt(9, 23)}h`,
      () => `${randomInt(1, 3)}d`,
      () => `${randomInt(4, 6)}d`,
      () => `${randomInt(1, 3)}w`,
    ],
    today: [
      () => `${randomInt(2, 12)}h`,
      () => `${randomInt(13, 23)}h`,
      () => `${randomInt(1, 4)}d`,
      () => `${randomInt(5, 6)}d`,
      () => `${randomInt(1, 4)}w`,
    ],
    days: [
      () => `${randomInt(1, 2)}d`,
      () => `${randomInt(3, 4)}d`,
      () => `${randomInt(5, 6)}d`,
      () => `${randomInt(1, 3)}w`,
      () => `${randomInt(4, 8)}w`,
    ],
    weeks: [
      () => `${randomInt(1, 2)}w`,
      () => `${randomInt(3, 5)}w`,
      () => `${randomInt(6, 9)}w`,
      () => `${randomInt(10, 16)}w`,
      () => `${randomInt(17, 26)}w`,
    ],
    old: [
      () => `${randomInt(5, 8)}w`,
      () => `${randomInt(9, 14)}w`,
      () => `${randomInt(15, 22)}w`,
      () => `${randomInt(23, 34)}w`,
      () => `${randomInt(35, 60)}w`,
    ],
  };
  const buckets = orderedRanges[range] || orderedRanges.today;
  const bucketIndex = Math.min(buckets.length - 1, Math.floor(progress * buckets.length));
  return buckets[bucketIndex]();
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let target = Math.random() * total;
  for (const item of items) {
    target -= item.weight;
    if (target <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

function randomStateForPosition(progress, range) {
  if (range === "fresh" && progress < 0.18) {
    return weightedPick([
      { value: "new", weight: 7 },
      { value: "received", weight: 2 },
      { value: "delivered", weight: 1 },
    ]);
  }

  if (progress < 0.28) {
    return weightedPick([
      { value: "new", weight: 3 },
      { value: "received", weight: 4 },
      { value: "delivered", weight: 2 },
      { value: "opened", weight: 1 },
    ]);
  }

  if (progress < 0.66) {
    return weightedPick([
      { value: "received", weight: 5 },
      { value: "opened", weight: 4 },
      { value: "delivered", weight: 1 },
      { value: "screenshot", weight: 1 },
    ]);
  }

  return weightedPick([
    { value: "opened", weight: 6 },
    { value: "received", weight: 5 },
    { value: "delivered", weight: 1 },
    { value: "screenshot", weight: 1 },
  ]);
}

function randomMediaForState(state) {
  if (state === "new") {
    return weightedPick([
      { value: "snap", weight: 6 },
      { value: "chat", weight: 2 },
      { value: "video", weight: 2 },
    ]);
  }
  return weightedPick([
    { value: "snap", weight: 5 },
    { value: "chat", weight: 3 },
    { value: "video", weight: 2 },
  ]);
}

function randomStreakForPosition(progress) {
  if (Math.random() > 0.32) return 0;
  const max = progress < 0.35 ? 8 : progress < 0.72 ? 25 : 80;
  return randomInt(2, max);
}

function randomizeAllChats(range) {
  chats.forEach((chat, index) => {
    const progress = chats.length <= 1 ? 0 : index / (chats.length - 1);
    const state = randomStateForPosition(progress, range);
    chat.message = {
      ...normalizeMessage(chat.message),
      state,
      media: randomMediaForState(state),
      time: randomOrderedTime(range, index, chats.length),
      streak: randomStreakForPosition(progress),
    };
  });
  savePeople();
  renderChats();
}

function applyStatusPreset(preset) {
  const presets = {
    received: { state: "received", media: "snap" },
    opened: { state: "opened", media: "snap" },
    "new-chat": { state: "new", media: "chat" },
    "new-snap": { state: "new", media: "snap" },
  };
  const next = presets[preset];
  if (!next) return;
  statusStateInput.value = next.state;
  statusMediaInput.value = next.media;
}

function createChatRow(chat, index) {
  const row = document.createElement("article");
  row.className = "chat-row";
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  row.setAttribute("aria-label", `Edit chat status for ${chat.name}`);
  row.addEventListener("click", () => openStatusEditor(index));
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStatusEditor(index);
    }
  });

  const avatarButton = document.createElement("button");
  avatarButton.className = "avatar-edit";
  avatarButton.type = "button";
  avatarButton.setAttribute("aria-label", `Edit ${chat.name} Bitmoji`);
  avatarButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openEditor("chat", index);
  });

  const avatar = document.createElement("span");
  avatar.className = ["chat-avatar", chat.avatarClass].filter(Boolean).join(" ");
  fillAvatar(avatar, chat);
  avatarButton.append(avatar);
  if (chat.friendEmoji) {
    const emoji = document.createElement("span");
    emoji.className = "friend-emoji-badge";
    emoji.dataset.emoji = chat.friendEmoji;
    avatarButton.append(emoji);
  }
  row.append(avatarButton);

  const main = document.createElement("div");
  main.className = "chat-main";

  const name = document.createElement("span");
  name.className = "chat-name";
  name.textContent = chat.name;

  const meta = createMessageMeta(chat.message);
  main.append(name, meta);
  row.append(main);

  if (chat.action === "snap") {
    const snap = document.createElement("span");
    snap.className = "snap-preview";
    snap.innerHTML = '<span class="orb" aria-hidden="true"></span><span>Snap</span>';
    row.append(snap);
  } else {
    const camera = document.createElement("button");
    camera.className = "camera-button";
    camera.type = "button";
    camera.setAttribute("aria-label", chat.action === "scan" ? `Scan with ${chat.name}` : `Camera for ${chat.name}`);
    camera.addEventListener("click", (event) => event.stopPropagation());
    camera.innerHTML = '<img src="icons/camera.png" alt="" />';
    row.append(camera);
  }

  return row;
}

function persistActivePerson() {
  if (activeType === "account") {
    saveAccount();
    renderAccount();
  } else {
    savePeople();
    renderChats();
  }
}

function applyPersonEdit() {
  const person = getActivePerson();
  if (!person) return;
  const username = usernameFromSnapchatValue(snapUrlInput.value);
  person.name = nameInput.value.trim() || person.name;
  person.avatar = getInitial(person.name);
  person.snapchatUsername = username;
  person.snapchatUrl = snapchatUrlFromUsername(username);
  person.avatarBg = bitmojiBgInput.value;
  persistActivePerson();
  publishLiveRows();
}

fetchSnapProfile.addEventListener("click", async () => {
  const person = getActivePerson();
  if (!person) return;
  const username = usernameFromSnapchatValue(snapUrlInput.value);
  const url = snapchatUrlFromUsername(username);
  if (!url) return;

  fetchSnapProfile.disabled = true;
  fetchSnapProfile.textContent = "Getting...";

  try {
    if (!window.location.protocol.startsWith("http")) {
      throw new Error("Open the app from http://172.20.10.4:5174/ so Snapchat links can be fetched.");
    }

    const apiUrl = createApiUrl("/api/snap-profile");
    apiUrl.searchParams.set("url", url);
    const response = await fetch(apiUrl.toString());
    const profile = await response.json();
    if (!response.ok) {
      throw new Error(profile.error || "Could not read Snapchat profile.");
    }

    person.name = profile.name || person.name;
    person.avatar = getInitial(person.name);
    person.avatarSourceUrl = profile.avatarUrl || "";
    person.avatarBg = bitmojiBgInput.value;
    person.avatarUrl = profile.avatarUrl ? await recolorAvatarBackground(profile.avatarUrl, bitmojiBgInput.value) : "";
    person.snapchatUsername = username;
    person.snapchatUrl = url;
    addBitmojiToLibrary(person);
    nameInput.value = person.name;
    updatePreview();
  } catch (error) {
    alert(error.message || "The Snapchat link could not be read.");
  } finally {
    fetchSnapProfile.disabled = false;
    fetchSnapProfile.textContent = "Get Bitmoji";
  }
});

bitmojiBgInput.addEventListener("input", async () => {
  const person = getActivePerson();
  if (!person?.avatarSourceUrl) return;
  person.avatarBg = bitmojiBgInput.value;
  person.avatarUrl = await recolorAvatarBackground(person.avatarSourceUrl, bitmojiBgInput.value);
  updatePreview();
});

statusPresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyStatusPreset(button.dataset.statusPreset);
  });
});

randomizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    randomizeAllChats(button.dataset.randomizeRange);
  });
});

editorForm.addEventListener("submit", (event) => {
  if (event.submitter?.id === "savePerson") {
    applyPersonEdit();
  }
});

statusForm.addEventListener("submit", (event) => {
  if (event.submitter?.id === "saveStatus") {
    chats[activeIndex].message = {
      state: statusStateInput.value,
      media: statusMediaInput.value,
      time: statusTimeInput.value.trim(),
      streak: Math.max(0, Number(statusStreakInput.value || 0)),
      liveText: chats[activeIndex].message?.liveText || "",
    };
    chats[activeIndex].liveVisible = liveVisibleInput.checked;
    savePeople();
    renderChats();
    sendPresence();
    publishLiveRows();
  }
});

composeButton.addEventListener("click", () => {
  renderBitmojiManager();
  if (typeof bitmojiManager.showModal === "function") {
    bitmojiManager.showModal();
  }
});

quickAddButton.addEventListener("click", () => {
  badgeInput.value = readSavedValue(badgeStorageKey, badge.textContent || "1");
  if (typeof badgeEditor.showModal === "function") {
    badgeEditor.showModal();
  }
});

chatTabBadge.addEventListener("click", (event) => {
  event.stopPropagation();
  chatBadgeInput.value = readSavedValue(chatBadgeStorageKey, chatTabBadge.textContent || "1");
  if (typeof chatBadgeEditor.showModal === "function") {
    chatBadgeEditor.showModal();
  }
});

chatBadgeForm.addEventListener("submit", (event) => {
  if (event.submitter?.id === "saveChatBadge") {
    const value = Math.max(0, Math.min(999, Number(chatBadgeInput.value || 0)));
    writeSavedValue(chatBadgeStorageKey, String(value));
    renderChatBadge();
  }
});

notificationButton.addEventListener("click", () => {
  if (typeof randomizerEditor.showModal === "function") {
    randomizerEditor.showModal();
  }
});

badgeForm.addEventListener("submit", (event) => {
  if (event.submitter?.id === "saveBadge") {
    const value = Math.max(0, Math.min(999, Number(badgeInput.value || 0)));
    writeSavedValue(badgeStorageKey, String(value));
    renderBadge();
  }
});

profileButton.addEventListener("click", () => openEditor("account"));
renderBitmojiPicker();
renderBadge();
renderChatBadge();
renderAccount();
renderChats();
sendPresence();
publishLiveRows();
connectLiveEvents();
pollLiveUpdates();
setInterval(sendPresence, 10000);
