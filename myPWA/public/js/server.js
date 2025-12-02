const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3009;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "..")));

// Path to DB
const dbPath = path.join(__dirname, "../../.database/datasource.db");

// Connect to DB
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("❌ DB error:", err.message);
  else console.log("✅ DB connected:", dbPath);
});

// MAIN API — GET ALL BASKETBALL PRODUCTS
app.get("/api/products", (req, res) => {
  const search = `%${(req.query.search || "").trim()}%`;

  const sql = `
    SELECT * FROM extension
    WHERE LOWER(category) = 'basketball'
      AND (name LIKE ? OR brand LIKE ? OR legacy LIKE ?)
  `;

  db.all(sql, [search, search, search], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Serve basketball page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "basketball.html"));
});

app.use(express.json());
app.use(express.static("public")); //

app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));
