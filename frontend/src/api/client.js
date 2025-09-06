// export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8003";

// export async function getModels() {
//   const r = await fetch(`${API_BASE}/models`);
//   return r.json();
// }

// export async function createSession(user_id, title="New Chat") {
//   const r = await fetch(`${API_BASE}/sessions`, {
//     method: "POST",
//     headers: {"Content-Type":"application/json"},
//     body: JSON.stringify({ user_id, title })
//   });
//   return r.json();
// }

// export async function listSessions(user_id) {
//   const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
//   return r.json();
// }


// export async function getSession(session_id) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}`);
//   return r.json();
// }

// export async function saveSessionMessages(session_id, messages) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages })
//   });
//   return r.json();
// }
// src/client.js
// export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8003/api";

// // Fetch available models
// export async function getModels() {
//   const r = await fetch(`${API_BASE}/models`);
//   if (!r.ok) throw new Error("Failed to fetch models");
//   return r.json();
// }

// // Create a new chat session
// export async function createSession(user_id, title = "New Chat") {
//   const r = await fetch(`${API_BASE}/sessions`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id, title }),
//   });
//   if (!r.ok) throw new Error("Failed to create session");
//   return r.json();
// }

// // List sessions for a user
// export async function listSessions(user_id) {
//   const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
//   if (!r.ok) throw new Error("Failed to fetch sessions");
//   return r.json();
// }

// // Get messages from a session
// export async function getSession(session_id) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}`);
//   if (!r.ok) throw new Error("Failed to fetch session messages");
//   return r.json();
// }

// // Save messages to a session
// export async function saveSessionMessages(session_id, messages) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//   });
//   if (!r.ok) throw new Error("Failed to save session messages");
//   return r.json();
// }

// src/client.js
// export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8003/api";

// // Fetch available models
// export async function getModels() {
//   const r = await fetch(`${API_BASE}/models`);
//   if (!r.ok) throw new Error(`Failed to fetch models: ${r.status}`);
//   return r.json();
// }

// // Create a new chat session
// export async function createSession(user_id, title = "New Chat") {
//   const r = await fetch(`${API_BASE}/sessions`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id, title }),
//   });
//   if (!r.ok) throw new Error(`Failed to create session: ${r.status}`);
//   return r.json();
// }

// // List sessions for a user
// export async function listSessions(user_id) {
//   const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
//   if (!r.ok) throw new Error(`Failed to fetch sessions: ${r.status}`);
//   return r.json();
// }

// // Get messages from a session
// export async function getSession(session_id) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}`);
//   if (!r.ok) throw new Error(`Failed to fetch session messages: ${r.status}`);
//   return r.json();
// }

// // Save messages to a session
// export async function saveSessionMessages(session_id, messages) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//   });
//   if (!r.ok) throw new Error(`Failed to save session messages: ${r.status}`);
//   return r.json();
// }
// export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8003/api";

// // Fetch available models
// export async function getModels() {
//   const r = await fetch(`${API_BASE}/models`);
//   if (!r.ok) throw new Error(`Failed to fetch models: ${r.status}`);
//   return r.json();
// }

// // Create a new chat session
// export async function createSession(user_id, title = "New Chat") {
//   const r = await fetch(`${API_BASE}/sessions`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id, title }),
//   });
//   if (!r.ok) throw new Error(`Failed to create session: ${r.status}`);
//   return r.json();
// }

// // List sessions for a user
// export async function listSessions(user_id) {
//   const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
//   if (!r.ok) throw new Error(`Failed to fetch sessions: ${r.status}`);
//   return r.json();
// }

// // Get messages from a session
// export async function getSession(session_id) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}`);
//   if (!r.ok) throw new Error(`Failed to fetch session messages: ${r.status}`);
//   return r.json();
// }

// // Save messages to a session
// export async function saveSessionMessages(session_id, messages) {
//   const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//   });
//   if (!r.ok) throw new Error(`Failed to save session messages: ${r.status}`);
//   return r.json();
// }
// client.js

// Ensure API_BASE points to the right backend
// client.js

// Use Render URL instead of localhost
// Detect API base dynamically
const defaultApiBase = "https://ai-chatbot-1-6xtp.onrender.com/api";

// Use env var if available, otherwise use default
export const API_BASE =
  import.meta.env.VITE_API_BASE?.trim() || defaultApiBase;

console.log("API_BASE in use:", API_BASE); // Debug log

// Fetch available models
export async function getModels() {
  const r = await fetch(`${API_BASE}/models`);
  if (!r.ok) throw new Error(`Failed to fetch models: ${r.status}`);
  return r.json();
}

// Create a new chat session
export async function createSession(user_id, title = "New Chat") {
  const r = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, title }),
  });
  if (!r.ok) throw new Error(`Failed to create session: ${r.status}`);
  return r.json();
}

// List sessions for a user
export async function listSessions(user_id) {
  const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
  if (!r.ok) throw new Error(`Failed to fetch sessions: ${r.status}`);
  return r.json();
}

// Get messages from a session
export async function getSession(session_id) {
  const r = await fetch(`${API_BASE}/sessions/${session_id}`);
  if (!r.ok) throw new Error(`Failed to fetch session messages: ${r.status}`);
  return r.json();
}

// Save messages to a session
export async function saveSessionMessages(session_id, messages) {
  const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!r.ok) throw new Error(`Failed to save session messages: ${r.status}`);
  return r.json();
}
