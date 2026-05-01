console.log("SERVER STARTING...");

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// AI route
app.post("/improve-text", async (req, res) => {
  const { text } = req.body;

  // basic validation
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "izRu3IKMM3qybmIref7vNtMwoQdKa9KT",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "user",
            content: `Improve this text: ${text}`
          }
        ]
      })
    });

    const data = await response.json();

    // send only clean output
    res.json({
      output: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});