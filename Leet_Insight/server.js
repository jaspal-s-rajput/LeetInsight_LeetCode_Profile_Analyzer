import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// serve your html/css/js files
app.use(express.static("."));

// proxy endpoint
app.post("/leetcode", async (req, res) => {
  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
