// // server.js - ExpressJS Backend Alternative
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { OpenAI } from "openai";
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// import crypto from "crypto"; // Ensure crypto is imported
// dotenv.config();

// const app = express();
// app.use(bodyParser.json());

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// // Validate environment variables
// if (!process.env.OPENAI_API_KEY) {
//   console.error("Error: OPENAI_API_KEY is not set in the environment variables.");
//   process.exit(1);
// }
// if (!process.env.GEMINI_API_KEY) {
//   console.error("Error: GEMINI_API_KEY is not set in the environment variables.");
//   process.exit(1);
// }

// // Set default values for optional environment variables
// const MAX_OUTPUT_TOKENS = Number(process.env.MAX_OUTPUT_TOKENS || 1024);

// // Debugging: Log environment variables
// console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
// console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
// console.log("MAX_OUTPUT_TOKENS:", MAX_OUTPUT_TOKENS);

// // Debugging: Log incoming requests
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   console.log("Request headers:", req.headers);
//   console.log("Request body:", req.body);
//   next();
// });

// // Define allowed origins for CORS
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];

// // Enable CORS for all origins
// app.use(cors());

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // Endpoint to list available models
// app.get("/models", (req, res) => {
//   console.log("Request received at /models"); // Debugging log
//   res.json({
//     openai: ["gpt-4o-mini"],
//     gemini: ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest"],
//     anthropic: [] // Add other providers if needed
//   });
//   console.log("Response sent from /models"); // Debugging log
// });

// // Chat streaming endpoint
// app.post("/chat/:session_id/stream", async (req, res) => {
//   const { session_id } = req.params;
//   console.log(`Stream request received for session_id: ${session_id}`); // Debugging log

//   // Ensure session_id exists
//   if (!sessions[session_id]) {
//     res.status(404).json({ error: `Session ID '${session_id}' not found.` });
//     return;
//   }

//   try {
//     // set SSE headers
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache, no-transform");
//     res.setHeader("Connection", "keep-alive");
//     res.flushHeaders && res.flushHeaders();
//     const { messages, model = "gpt-4o-mini", provider = "openai" } = req.body;
//     const normalizedProvider = provider.toLowerCase(); // Normalize provider to lowercase

//     if (!messages || !Array.isArray(messages)) {
//       res.status(400).json({ error: "Invalid request: 'messages' must be an array." });
//       return;
//     }

//     if (normalizedProvider === "gemini" || model.startsWith("gemini")) {
//       // Format messages for Gemini API
//       const geminiModel = model && model !== ":generateContent" ? model : "gemini-1.5-flash";
//       const contents = messages.map(msg => ({
//         role: msg.role === "system" ? "user" : msg.role,
//         parts: [{ text: msg.content }]
//       }));

//       try {
//         const geminiResp = await fetch(
//           `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               contents,
//               generationConfig: {
//                 maxOutputTokens: MAX_OUTPUT_TOKENS,
//                 temperature: 0.7
//               }
//             })
//           }
//         );

//         if (!geminiResp.ok) {
//           const error = await geminiResp.text();
//           console.error("Gemini API error:", error);
//           res.write(`data: ${JSON.stringify({ error: `Gemini API error: ${error}` })}\n\n`);
//           res.write("data: [DONE]\n\n");
//           return;
//         }

//         const reader = geminiResp.body.getReader();
//         const decoder = new TextDecoder();
//         let buffer = "";

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           buffer += decoder.decode(value, { stream: true });
//           const lines = buffer.split("\n");
//           buffer = lines.pop() || "";

//           for (const line of lines) {
//             if (line.startsWith("data: ")) {
//               const data = line.slice(6).trim();
//               if (!data || data === "[DONE]") continue;

//               try {
//                 const json = JSON.parse(data);
//                 const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
//                 if (text) {
//                   res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
//                   console.log("Streamed delta:", text); // Log streamed data
//                 }
//               } catch (e) {
//                 console.error("Error parsing Gemini response:", e);
//               }
//             }
//           }
//         }

//         res.write("data: [DONE]\n\n");
//       } catch (error) {
//         console.error("Error in Gemini stream:", error);
//         res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
//         res.write("data: [DONE]\n\n");
//       }
//     } else if (normalizedProvider === "openai") {
//       try {
//         const stream = await openai.chat.completions.create({
//           model,
//           messages,
//           stream: true,
//           max_tokens: MAX_OUTPUT_TOKENS,
//         });

//         for await (const chunk of stream) {
//           const delta = chunk.choices?.[0]?.delta?.content || "";
//           if (delta) {
//             res.write(`data: ${JSON.stringify({ delta })}\n\n`);
//             console.log("Streamed delta:", delta); // Log streamed data
//           }
//         }
//         res.write("data: [DONE]\n\n");
//       } catch (error) {
//         console.error("OpenAI API Error:", error);
//         res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
//       }
//     } else {
//       res.write(`data: ${JSON.stringify({ error: `Provider '${provider}' is not supported. Supported providers are 'openai' and 'gemini'.` })}\n\n`);
//     }
//   } catch (e) {
//     console.error("Unexpected Error:", e);
//     res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
//   } finally {
//     res.end();
//   }
// });

// // In-memory session storage
// const sessions = {};
// const messages = {};

// // Create a new chat session
// app.post("/sessions", (req, res) => {
//   const { title } = req.body;
//   const user_id = "anonymous";
//   const session_id = crypto.randomUUID();
//   sessions[session_id] = { id: session_id, user_id, title, created_at: new Date().toISOString() };
//   messages[session_id] = [];
//   res.json({ session_id });
// });

// // List sessions for a user
// app.get("/sessions", (req, res) => {
//   const { user_id } = req.query;
//   const userSessions = Object.values(sessions)
//     .filter(s => s.user_id === user_id)
//     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//   res.json(userSessions);
// });

// // Get messages for a session
// app.get("/sessions/:session_id", (req, res) => {
//   const { session_id } = req.params;
//   res.json(messages[session_id] || []);
// });

// // Save messages for a session
// app.post("/sessions/:session_id/messages", (req, res) => {
//   const { session_id } = req.params;
//   const { messages: msgs } = req.body;
//   if (!Array.isArray(msgs)) return res.status(400).json({ error: "messages must be an array" });
//   messages[session_id] = msgs;
//   res.json({ success: true });
// });

// // Start the server
// app.listen(8003, () => console.log("Server on :8003"));

// server.js - Fixed ExpressJS Backend
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ---- ENVIRONMENT ----
const PORT = process.env.APP_PORT || 8003;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_OUTPUT_TOKENS = Number(process.env.MAX_OUTPUT_TOKENS || 1024);

// Validate required env vars
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is not set.");
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is not set.");
  process.exit(1);
}

// ---- CORS ----
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// ---- In-memory DB ----
const sessions = {};
const messages = {};

// ---- ROUTES ----

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Models list
app.get("/models", (req, res) => {
  res.json({
    openai: ["gpt-4o-mini"],
    gemini: [
      "gemini-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
    ],
    anthropic: [],
  });
});

// Create a new chat session
app.post("/sessions", (req, res) => {
  const { title = "New Chat", user_id = "anonymous" } = req.body;
  const session_id = crypto.randomUUID();

  sessions[session_id] = {
    id: session_id,
    user_id,
    title,
    created_at: new Date().toISOString(),
  };
  messages[session_id] = [];

  res.json(sessions[session_id]);
});

// List sessions for a user
app.get("/sessions", (req, res) => {
  const { user_id } = req.query;
  const userSessions = Object.values(sessions)
    .filter((s) => s.user_id === user_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(userSessions);
});

// Get a session object
app.get("/sessions/:session_id", (req, res) => {
  const { session_id } = req.params;
  if (!sessions[session_id]) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(sessions[session_id]);
});

// Get messages for a session
app.get("/sessions/:session_id/messages", (req, res) => {
  const { session_id } = req.params;
  res.json(messages[session_id] || []);
});

// Save messages for a session
app.post("/sessions/:session_id/messages", (req, res) => {
  const { session_id } = req.params;
  const { messages: msgs } = req.body;

  if (!Array.isArray(msgs)) {
    return res.status(400).json({ error: "messages must be an array" });
  }
  messages[session_id] = msgs;
  res.json({ success: true });
});

// ---- Chat streaming ----
app.post("/chat/:session_id/stream", async (req, res) => {
  const { session_id } = req.params;
  if (!sessions[session_id]) {
    return res.status(404).json({ error: `Session '${session_id}' not found.` });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders && res.flushHeaders();

  try {
    const { messages: msgs, model = "gpt-4o-mini", provider = "openai" } =
      req.body;

    if (!msgs || !Array.isArray(msgs)) {
      res.write(
        `data: ${JSON.stringify({
          error: "Invalid request: 'messages' must be an array.",
        })}\n\n`
      );
      res.write("data: [DONE]\n\n");
      return;
    }

    if (provider.toLowerCase() === "openai") {
      const stream = await openai.chat.completions.create({
        model,
        messages: msgs,
        stream: true,
        max_tokens: MAX_OUTPUT_TOKENS,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content || "";
        if (delta) {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
    } else if (provider.toLowerCase() === "gemini" || model.startsWith("gemini")) {
      // TODO: Add Gemini SSE streaming implementation
      res.write(
        `data: ${JSON.stringify({
          error: "Gemini streaming not fully implemented yet.",
        })}\n\n`
      );
      res.write("data: [DONE]\n\n");
    } else {
      res.write(
        `data: ${JSON.stringify({
          error: `Provider '${provider}' not supported.`,
        })}\n\n`
      );
      res.write("data: [DONE]\n\n");
    }
  } catch (e) {
    console.error("Stream error:", e);
    res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
    res.write("data: [DONE]\n\n");
  } finally {
    res.end();
  }
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
