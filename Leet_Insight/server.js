import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// serve static files
app.use(express.static(process.cwd()));

// ✅ root route — THIS fixes your error
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "home.html"));
});

// proxy route
app.post("/leetcode", async (req, res) => {
  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body)
    });

    res.json(await response.json());
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(process.env.PORT || 3000);
