console.log("SERVER STARTING...");

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// keep alive log
setInterval(() => {
  console.log("App is alive");
}, 10000);

app.get("/", (req, res) => {
  console.log("Health check hit");
  res.send("Server is working");
});

app.post("/improve-text", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 2cltqZLNf0JgacP4pniL7zXn8zVneIBH",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          {
            role: "user",
            content: `Rewrite the following sentence in clear, correct English. Return ONLY the improved sentence:\n\n${text}`
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const cleaned = raw.split("\n")[0];

    res.json({ output: cleaned });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});