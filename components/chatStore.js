const KEY = 'cristio_chat_msgs';
let memory = null;

export function loadChat() {
  if (memory) return memory;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      memory = JSON.parse(saved);
      return memory;
    }
  } catch {}
  memory = [];
  return memory;
}

export function saveChat(msgs) {
  memory = msgs;
  try {
    localStorage.setItem(KEY, JSON.stringify(msgs));
  } catch {}
}

export function clearChat() {
  memory = [];
  try { localStorage.removeItem(KEY); } catch {}
}
